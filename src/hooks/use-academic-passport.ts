import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACADEMIC_RANK_QUERY_KEY } from "@/hooks/use-academic-rank";
import {
  ACADEMIC_PASSPORT_EVENT,
  DEFAULT_ACADEMIC_PASSPORT_PREFERENCES,
  loadAcademicPassportPreferences,
  normalizeAcademicPassportPreferences,
  resetAcademicPassportPreferences,
  saveAcademicPassportPreferences,
  type AcademicPassportPreferences,
} from "@/lib/academic-passport";
import {
  getAcademicPassportFromSupabase,
  resetAcademicPassportInSupabase,
  saveAcademicPassportToSupabase,
} from "@/lib/academic-passport-api";
import { supabase } from "@/lib/supabase";

function browserStorage() {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

function timestamp(value: string | null | undefined) {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function useAcademicPassportPreferences(userId: string | null | undefined) {
  const queryClient = useQueryClient();
  const [preferences, setPreferencesState] = useState<AcademicPassportPreferences>(
    DEFAULT_ACADEMIC_PASSPORT_PREFERENCES,
  );
  const [syncError, setSyncError] = useState<string | null>(null);
  const preferencesRef = useRef(preferences);
  const pendingSyncRef = useRef<AcademicPassportPreferences | null>(null);
  const syncWorkerRef = useRef<Promise<void> | null>(null);
  const syncWorkerTokenRef = useRef<symbol | null>(null);

  const publish = useCallback((next: AcademicPassportPreferences) => {
    preferencesRef.current = next;
    setPreferencesState(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(ACADEMIC_PASSPORT_EVENT));
    }
  }, []);

  useEffect(() => {
    pendingSyncRef.current = null;
    syncWorkerRef.current = null;
    syncWorkerTokenRef.current = null;
  }, [userId]);

  useEffect(() => {
    const local = loadAcademicPassportPreferences(userId, browserStorage());
    preferencesRef.current = local;
    setPreferencesState(local);
    setSyncError(null);
    if (!userId) return;

    let active = true;
    void getAcademicPassportFromSupabase(userId)
      .then((remote) => {
        if (!active || !remote) return;
        const current = preferencesRef.current;
        if (timestamp(remote.preferences.updatedAt) < timestamp(current.updatedAt)) return;
        const storage = browserStorage();
        if (storage) saveAcademicPassportPreferences(userId, remote.preferences, storage);
        preferencesRef.current = remote.preferences;
        setPreferencesState(remote.preferences);
      })
      .catch((cause) => {
        if (active) {
          setSyncError(cause instanceof Error ? cause.message : "Unable to load Passport setup.");
        }
      });
    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!supabase || !userId) return;
    const channel = supabase
      // React replays effects in development before Supabase's async channel
      // removal settles, so each effect instance needs its own channel name.
      .channel(`academic-passport:${userId}:${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "academic_passports",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void getAcademicPassportFromSupabase(userId)
            .then((remote) => {
              if (!remote) return;
              const current = preferencesRef.current;
              if (timestamp(remote.preferences.updatedAt) < timestamp(current.updatedAt)) return;
              const storage = browserStorage();
              if (storage) saveAcademicPassportPreferences(userId, remote.preferences, storage);
              publish(remote.preferences);
            })
            .catch((cause) => {
              setSyncError(
                cause instanceof Error ? cause.message : "Unable to refresh Passport setup.",
              );
            });
        },
      )
      .subscribe();

    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [publish, userId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => {
      const next = loadAcademicPassportPreferences(userId, browserStorage());
      preferencesRef.current = next;
      setPreferencesState(next);
    };
    window.addEventListener(ACADEMIC_PASSPORT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ACADEMIC_PASSPORT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [userId]);

  const queueRemoteSync = useCallback(
    (next: AcademicPassportPreferences) => {
      if (!userId) return Promise.resolve();
      pendingSyncRef.current = next;
      if (syncWorkerRef.current) return syncWorkerRef.current;

      const workerToken = Symbol(userId);
      syncWorkerTokenRef.current = workerToken;
      const worker = (async () => {
        try {
          while (syncWorkerTokenRef.current === workerToken && pendingSyncRef.current) {
            await new Promise((resolve) => globalThis.setTimeout(resolve, 120));
            if (syncWorkerTokenRef.current !== workerToken) break;
            const pending = pendingSyncRef.current;
            pendingSyncRef.current = null;
            if (pending) await saveAcademicPassportToSupabase(userId, pending);
          }
        } finally {
          if (syncWorkerTokenRef.current === workerToken) {
            syncWorkerRef.current = null;
            syncWorkerTokenRef.current = null;
          }
        }
      })();
      syncWorkerRef.current = worker;
      return worker;
    },
    [userId],
  );

  const setPreferences = useCallback(
    async (next: AcademicPassportPreferences) => {
      const stamped = normalizeAcademicPassportPreferences({
        ...next,
        updatedAt: new Date().toISOString(),
      });
      const storage = browserStorage();
      const safe =
        userId && storage ? saveAcademicPassportPreferences(userId, stamped, storage) : stamped;
      publish(safe);
      if (!userId) return safe;

      try {
        await queueRemoteSync(safe);
        setSyncError(null);
        await queryClient.invalidateQueries({ queryKey: [ACADEMIC_RANK_QUERY_KEY, userId] });
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : "Unable to sync Passport setup.";
        setSyncError(message);
        throw cause;
      }
      return safe;
    },
    [publish, queryClient, queueRemoteSync, userId],
  );

  const resetPreferences = useCallback(async () => {
    const storage = browserStorage();
    const next =
      userId && storage
        ? resetAcademicPassportPreferences(userId, storage)
        : { ...DEFAULT_ACADEMIC_PASSPORT_PREFERENCES };
    publish(next);
    if (!userId) return;
    try {
      pendingSyncRef.current = null;
      await syncWorkerRef.current?.catch(() => undefined);
      await resetAcademicPassportInSupabase(userId);
      setSyncError(null);
      await queryClient.invalidateQueries({ queryKey: [ACADEMIC_RANK_QUERY_KEY, userId] });
    } catch (cause) {
      setSyncError(cause instanceof Error ? cause.message : "Unable to reset Passport setup.");
      throw cause;
    }
  }, [publish, queryClient, userId]);

  return { preferences, setPreferences, resetPreferences, syncError };
}

import { useCallback, useEffect, useState } from "react";

export type InterfacePreferences = {
  reduceMotion: boolean;
  textScale: number;
  enhancedContrast: boolean;
  soundEffects: boolean;
  language: "en" | "ta" | "te" | "hi";
};

export const DEFAULT_INTERFACE_PREFERENCES: InterfacePreferences = {
  reduceMotion: false,
  textScale: 1,
  enhancedContrast: false,
  soundEffects: true,
  language: "en",
};

const STORAGE_PREFIX = "scholaport:interface:v1";
const EVENT_NAME = "scholaport:interface-updated";

function storageKey(userId: string | null | undefined) {
  return `${STORAGE_PREFIX}:${userId ?? "guest"}`;
}

function supportedLanguage(value: unknown): InterfacePreferences["language"] {
  return value === "ta" || value === "te" || value === "hi" ? value : "en";
}

function loadPreferences(userId: string | null | undefined, profileLanguage?: string | null) {
  if (typeof window === "undefined") return DEFAULT_INTERFACE_PREFERENCES;
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey(userId)) ?? "null") as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { ...DEFAULT_INTERFACE_PREFERENCES, language: supportedLanguage(profileLanguage) };
    }
    const candidate = value as Partial<InterfacePreferences>;
    return {
      reduceMotion: candidate.reduceMotion === true,
      textScale:
        typeof candidate.textScale === "number"
          ? Math.min(1.3, Math.max(0.9, candidate.textScale))
          : (candidate as { largerText?: boolean }).largerText
            ? 1.125
            : 1,
      enhancedContrast: candidate.enhancedContrast === true,
      soundEffects: candidate.soundEffects !== false,
      language: supportedLanguage(candidate.language ?? profileLanguage),
    };
  } catch {
    return DEFAULT_INTERFACE_PREFERENCES;
  }
}

function applyPreferences(preferences: InterfacePreferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.reduceMotion = String(preferences.reduceMotion);
  root.dataset.textScale = String(preferences.textScale);
  root.dataset.enhancedContrast = String(preferences.enhancedContrast);
  root.dataset.soundEffects = String(preferences.soundEffects);
  root.dataset.language = preferences.language;
  root.lang = preferences.language;
  root.style.setProperty("--interface-text-scale", String(preferences.textScale));
  root.style.setProperty("--interface-text-size", `${preferences.textScale * 100}%`);
}

export function useInterfacePreferences(
  userId: string | null | undefined,
  profileLanguage?: string | null,
) {
  const [preferences, setPreferencesState] = useState<InterfacePreferences>(() =>
    loadPreferences(userId, profileLanguage),
  );

  useEffect(() => {
    const next = loadPreferences(userId, profileLanguage);
    setPreferencesState(next);
    applyPreferences(next);
  }, [profileLanguage, userId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => {
      const next = loadPreferences(userId, profileLanguage);
      setPreferencesState(next);
      applyPreferences(next);
    };
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, [profileLanguage, userId]);

  const setPreferences = useCallback(
    (next: InterfacePreferences) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey(userId), JSON.stringify(next));
        window.dispatchEvent(new CustomEvent(EVENT_NAME));
      }
      setPreferencesState(next);
      applyPreferences(next);
    },
    [userId],
  );

  const updatePreference = useCallback(
    <K extends keyof InterfacePreferences>(key: K, value: InterfacePreferences[K]) => {
      setPreferences({ ...preferences, [key]: value });
    },
    [preferences, setPreferences],
  );

  return { preferences, setPreferences, updatePreference };
}

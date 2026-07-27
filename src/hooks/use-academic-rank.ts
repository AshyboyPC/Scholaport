import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAcademicRankFromSupabase } from "@/lib/academic-rank-api";
import { supabase } from "@/lib/supabase";

export const ACADEMIC_RANK_QUERY_KEY = "academic-rank";

export function invalidateAcademicRank(queryClient: QueryClient, userId?: string | null) {
  return queryClient.invalidateQueries({
    queryKey: userId ? [ACADEMIC_RANK_QUERY_KEY, userId] : [ACADEMIC_RANK_QUERY_KEY],
  });
}

export function useAcademicRank(userId: string | null | undefined) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [ACADEMIC_RANK_QUERY_KEY, userId],
    queryFn: () => getAcademicRankFromSupabase(userId!),
    enabled: Boolean(userId),
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (!supabase || !userId) return;
    const channel = supabase
      .channel(`academic-rank:${userId}:${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "academic_rank_progress",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: [ACADEMIC_RANK_QUERY_KEY, userId] });
        },
      )
      .subscribe();

    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [queryClient, userId]);

  return query;
}

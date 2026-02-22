import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type {
  UserProfile,
  UserStats,
  Debate,
  DebateResult,
  UserRole,
} from "../backend";

// Get caller user profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Get caller user role
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["currentUserRole"],
    queryFn: async () => {
      if (!actor) return "guest" as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

// Save user profile mutation
export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Add debate to history
export function useAddToDebateHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (debate: Debate) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addToDebateHistory(debate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Get user stats
export function useGetUserStats() {
  const { actor, isFetching } = useActor();
  const { data: profile } = useGetCallerUserProfile();

  return useQuery<UserStats | null>({
    queryKey: ["userStats"],
    queryFn: async () => {
      if (!actor || !profile) return null;
      return profile.stats;
    },
    enabled: !!actor && !isFetching && !!profile,
  });
}

// Fetch top users by score (leaderboard)
export function useFetchTopUsersByScore(limit: number = 10) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["topUsersByScore", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.fetchTopUsersByScore(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

// Make HTTP outcall (for AI debate responses)
export function useMakeHttpOutcall() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.makeHttpOutcall(url);
    },
  });
}

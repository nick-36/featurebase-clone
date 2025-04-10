import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      retry: 1,
    },
  },
});

export const queryKeys = {
  auth: {
    session: ["auth", "session"],
    all: ["auth"],
  },
  surveys: {
    all: ["surveys"] as const,
    detail: (id: string) => ["survey", id],
    withSubmissions: (id: string) => ["surveys", id, "withSubmissions"],
  },
  dashboard: {
    stats: ["dashboard", "stats"],
  },
};

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
    session: ["auth", "session"] as const,
    all: ["auth"] as const,
  },
  surveys: {
    all: ["surveys"] as const,
    detail: (id: string) => ["surveys", id] as const,
    responses: (id: string) => ["surveys", id, "responses"] as const,
  },
};

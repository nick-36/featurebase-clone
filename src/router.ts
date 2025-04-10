import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { DefaultPendingSkeleton } from "@/components/layout/loadingSkeleton.tsx";

export const router = createRouter({
  routeTree,
  defaultPendingComponent: DefaultPendingSkeleton,
  defaultPendingMs: 50,
  defaultPendingMinMs: 300,
});

import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { AppRouteContext } from "./global";
import { DefaultPendingSkeleton } from "@/components/layout/loadingSkeleton.tsx";

export const router = createRouter({
  routeTree,
  defaultPendingComponent: DefaultPendingSkeleton,
  defaultPendingMs: 50,
  defaultPendingMinMs: 300,
  context: {
    header: {
      showAuthButtons: true,
      hideHeader: false,
    },
  } as AppRouteContext,
});

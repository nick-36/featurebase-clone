// import { createRouter } from "@tanstack/react-router";
// import { routeTree } from "./routeTree.gen.ts";
// import { DefaultPendingSkeleton } from "@/components/layout/loadingSkeleton.tsx";

// export const router = createRouter({
//   routeTree,
//   defaultPendingComponent: DefaultPendingSkeleton,
//   defaultPendingMs: 50,
//   defaultPendingMinMs: 300,
// });

// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// // Register router for type-safety
// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }

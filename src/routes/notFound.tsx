import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import NotFoundComponent from "@/components/layout/notFound";

export const Route = createRoute({
  path: "*",
  getParentRoute: () => rootRoute,
  component: NotFoundComponent,
});

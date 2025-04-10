import Header from "@/components/layout/header";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFoundComponent from "@/components/layout/notFound";
import { ErrorDisplay } from "@/components/layout/errorDisplay";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorDisplay,
  notFoundComponent: NotFoundComponent,
  context: () => ({
    header: {
      showAuthButtons: true,
    },
  }),
});

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

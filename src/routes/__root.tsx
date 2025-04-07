import Header from "@/components/layout/header";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFoundComponent from "@/components/layout/notFound";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorBoundary,
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

function ErrorBoundary({ error }: { error: Error }) {
  console.error("App Error:", error);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h1>
      <p className="text-gray-600 mb-6">{error.message}</p>
    </div>
  );
}

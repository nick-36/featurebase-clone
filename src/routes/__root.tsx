import Header from "@/components/layout/header";
import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorBoundary,
  notFoundComponent: NotFoundComponent,
  context: () => ({
    header: {
      showAuthButtons: true,
      showCreateSurvey: true,
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

function NotFoundComponent() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">404 - Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Button onClick={() => navigate({ to: "/" })} className="cursor-pointer">
        Go back home
      </Button>
    </div>
  );
}

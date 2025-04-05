// import { createFileRoute } from "@tanstack/react-router";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export const Route = createRoute({
  path: "*",
  getParentRoute: () => rootRoute,
  component: NotFoundComponent,
});

function NotFoundComponent() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">404 - Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Button onClick={() => navigate({ to: "/" })}>Go back home</Button>
    </div>
  );
}

import { ErrorDisplay } from "@/components/layout/errorDisplay";
import Header from "@/components/layout/header";
import NotFoundComponent from "@/components/layout/notFound";

import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto text-center text-gray-500">
          Survey Builder - Built with React, Tailwind, shadcn/ui and Supabase
        </div>
      </footer>
    </div>
  ),
  notFoundComponent: NotFoundComponent,
  errorComponent: (error: any) => {
    return <ErrorDisplay error={error} />;
  },
});

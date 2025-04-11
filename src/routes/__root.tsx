import Header from "@/components/layout/header";
// import { Outlet, createRootRoute } from "@tanstack/react-router";
// import NotFoundComponent from "@/components/layout/notFound";
// import { ErrorDisplay } from "@/components/layout/errorDisplay";

// export const Route = createRootRoute({
//   component: RootComponent,
//   errorComponent: ErrorDisplay,
//   notFoundComponent: NotFoundComponent,
//   context: () => ({
//     header: {
//       showAuthButtons: true,
//     },
//   }),
// });

// function RootComponent() {
//   return (
//     <>
//       <Header />
//       <Outlet />
//     </>
//   );
// }

// src/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import Logo from "@/components/ui/logo";
import UserAvatar from "@/components/layout/userAvatar";

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
});

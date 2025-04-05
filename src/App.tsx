import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { router } from "@/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type AppProps = { router: typeof router };

const queryClient = new QueryClient();

const App = ({ router }: AppProps): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;

import { createFileRoute, Outlet } from "@tanstack/react-router";

// routes/_mainLayout.route.jsx
import Header from "@/components/layout/header";
import DesktopSidebar from "@/components/layout/dashboardSidebar";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { withAuth } from "@/hoc/withAuth";

// Create a context to control layout visibility
export const LayoutContext = createContext<{
  showHeader: boolean;
  showSidebar: boolean;
  headerProps: object;
  setLayoutConfig: Dispatch<
    SetStateAction<{
      showHeader: boolean;
      showSidebar: boolean;
      headerProps: object;
    }>
  >;
}>({
  showHeader: true,
  showSidebar: true,
  headerProps: {},
  setLayoutConfig: () => {},
});

export const useLayoutContext = () => useContext(LayoutContext);

function DashboardLayout() {
  const [layoutConfig, setLayoutConfig] = useState({
    showHeader: true,
    showSidebar: true,
    headerProps: {},
  });

  const { showHeader, showSidebar, headerProps } = layoutConfig;

  return (
    <LayoutContext.Provider
      value={{
        ...layoutConfig,
        setLayoutConfig,
      }}
    >
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr]">
        {showSidebar && <DesktopSidebar />}
        <div
          className={`flex flex-col overflow-hidden ${!showSidebar ? "md:col-span-2 lg:col-span-2" : ""}`}
        >
          {showHeader && <Header {...headerProps} />}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}

export const Route = createFileRoute("/dashboard/_dashboardLayout")({
  component: withAuth(DashboardLayout),
});

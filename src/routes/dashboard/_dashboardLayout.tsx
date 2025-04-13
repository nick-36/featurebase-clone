import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import Header from "@/components/layout/header";
import DesktopSidebar from "@/components/layout/dashboardSidebar";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { withAuth } from "@/hoc/withAuth";
import DashboardBreadcrumb from "@/components/layout/dashboardBreadCrumb";
import type { BreadcrumbItemType } from "@/components/layout/dashboardBreadCrumb";

// Create a context to control layout visibility
export const LayoutContext = createContext<{
  showHeader: boolean;
  showSidebar: boolean;
  headerProps: object;
  breadcrumbItems: BreadcrumbItemType[];
  setLayoutConfig: Dispatch<
    SetStateAction<{
      showHeader: boolean;
      showSidebar: boolean;
      headerProps: object;
      breadcrumbItems: BreadcrumbItemType[];
    }>
  >;
}>({
  showHeader: true,
  showSidebar: true,
  headerProps: {},
  breadcrumbItems: [],
  setLayoutConfig: () => {},
});

export const useLayoutContext = () => useContext(LayoutContext);

// Route to breadcrumb mapping
const routeToBreadcrumb: Record<string, BreadcrumbItemType> = {
  "/dashboard": { label: "Dashboard" },
  "/dashboard/surveys": { label: "Surveys" },
  "/dashboard/analytics": { label: "Analytics" },
  // Add more mappings as needed
};

function DashboardLayout() {
  const [layoutConfig, setLayoutConfig] = useState({
    showHeader: true,
    showSidebar: true,
    headerProps: {},
    breadcrumbItems: [] as BreadcrumbItemType[],
  });

  const { showSidebar, breadcrumbItems } = layoutConfig;

  // Get current route matches from TanStack Router
  const matches = useMatches();

  // Update breadcrumbs based on the current route
  useEffect(() => {
    if (matches.length > 0) {
      const currentRoute = matches[matches.length - 1];
      const path = currentRoute.pathname;

      // Create breadcrumb trail
      const newBreadcrumbItems: BreadcrumbItemType[] = [];

      // Check if we're in a dynamic route (like a specific survey)
      if (path.includes("/$")) {
        // For nested/dynamic routes
        const routeParts = path.split("/").filter(Boolean);
        let currentPath = "";

        routeParts.forEach((part, index) => {
          if (!part.startsWith("$")) {
            currentPath += "/" + part;

            if (routeToBreadcrumb[currentPath]) {
              const isLast = index === routeParts.length - 1;

              newBreadcrumbItems.push({
                label: routeToBreadcrumb[currentPath].label,
                href: isLast ? undefined : currentPath,
              });
            }
          } else {
            // For dynamic segments, try to get a title from route context or params
            const entityId = currentRoute.params[part.substring(1)]; // Strip $ from param name
            const entityTitle =
              currentRoute.context?.pageTitle || `Details ${entityId}`;

            newBreadcrumbItems.push({
              label: entityTitle,
            });
          }
        });
      } else {
        // For standard routes
        Object.keys(routeToBreadcrumb).forEach((routePath) => {
          if (path.startsWith(routePath)) {
            newBreadcrumbItems.push({
              ...routeToBreadcrumb[routePath],
              href: path === routePath ? undefined : routePath,
            });
          }
        });
      }

      // Update layout config with new breadcrumbs
      setLayoutConfig((prev) => ({
        ...prev,
        breadcrumbItems: newBreadcrumbItems,
      }));
    }
  }, [matches]);

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
          <main className="flex-1">
            {breadcrumbItems.length > 0 && (
              <div className="px-4 md:px-6 pt-4">
                <DashboardBreadcrumb items={breadcrumbItems} />
              </div>
            )}
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

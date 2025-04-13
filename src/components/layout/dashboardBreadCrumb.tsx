// src/components/layout/dashboardBreadcrumb.tsx
import React from "react";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@tanstack/react-router";

export type BreadcrumbItemType = {
  label: string;
  href?: string;
};

interface DashboardBreadcrumbProps {
  items: BreadcrumbItemType[];
  className?: string;
}

const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({
  items,
  className = "",
}) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/">
            <BreadcrumbLink>
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbSeparator />
            {item.href ? (
              <Link to={item.href}>
                <BreadcrumbLink>{item.label}</BreadcrumbLink>
              </Link>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;

import { sidebarNavLinks } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";

const DashboardSidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    navigate({ to: href });
  };

  return (
    <div className="hidden md:grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 py-4">
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {sidebarNavLinks.map((item) => {
                return (
                  <Link
                    to={item.href}
                    key={item.id}
                    activeOptions={{ exact: true }}
                    activeProps={{
                      className: "bg-muted text-primary",
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => handleNavigation(item.href)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;

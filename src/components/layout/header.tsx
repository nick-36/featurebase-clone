import Logo from "@/components/ui/logo";
import { Link, useMatches, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import { useSession } from "@/hooks/auth";
import UserAvatar from "@/components/layout/userAvatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Menu,
  List,
} from "lucide-react";
import { useState } from "react";
import CreateSurveyBtn from "./createSurvey";

const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { session } = useSession();
  const isLoading = useAuthStore((state) => state.loading);
  const matches = useMatches();
  const navigate = useNavigate();
  const headerProps = matches.at(-1)?.context?.header || {};
  const { showAuthButtons = true, hideHeader } = headerProps;

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      id: "dashboard",
    },
    {
      title: "Surveys",
      href: "/dashboard/surveys",
      icon: ClipboardList,
      id: "surveys",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      id: "analytics",
    },
  ];

  const handleNavigation = (href: string) => {
    setIsSheetOpen(false);
    navigate({ to: href });
  };

  if (isLoading) {
    return <nav className="w-full h-[60px] p-4 bg-white shadow-sm" />;
  }

  if (hideHeader) {
    return <></>;
  }

  return (
    <nav className="w-full flex justify-between items-center h-[60px] px-3 sm:px-4 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="py-4">
              <Logo />
            </div>
            <nav className="grid gap-2 text-lg font-medium">
              {sidebarItems.map((item) => {
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
          </SheetContent>
        </Sheet>
        <div className="ml-1">
          <Logo />
        </div>
      </div>

      {session ? (
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            asChild
            className="hidden sm:flex text-xs sm:text-sm"
          >
            <Link to="/dashboard/surveys">
              <List className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">My Surveys</span>
              <span className="sm:hidden">Surveys</span>
            </Link>
          </Button>
          <div className="hidden xs:block md:block">
            <CreateSurveyBtn btnView={true} />
          </div>
          <UserAvatar />
        </div>
      ) : (
        <>
          {showAuthButtons && (
            <div className="flex gap-2 sm:gap-4 items-center">
              <Link to="/auth/login">
                <Button
                  size="sm"
                  className="cursor-pointer text-xs sm:text-sm sm:px-4 sm:size-default"
                >
                  Login
                </Button>
              </Link>
              <Link to="/auth/signup" className="hidden xs:block md:block">
                <Button
                  variant="secondary"
                  size="sm"
                  className="cursor-pointer text-xs sm:text-sm sm:px-4 sm:size-default"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default Header;

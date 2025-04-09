import Logo from "@/components/ui/logo";
import { Link, useMatches } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuthStore from "@/stores/authStore";
import { useSession, useSignOut } from "@/hooks/auth";

const Header = () => {
  const { session } = useSession();
  const isLoading = useAuthStore((state) => state.loading);
  const signOutMutation = useSignOut();
  const matches = useMatches();
  const headerProps = matches.at(-1)?.context?.header || {};
  const { showAuthButtons = true } = headerProps;

  const userEmail = session?.user?.email || "anonymous@example.com";
  const userInitial = userEmail?.charAt(0)?.toUpperCase();

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  if (isLoading) {
    return <nav className="w-full h-[60px] p-4 bg-white shadow-sm" />;
  }

  return (
    <nav className="w-full flex justify-between items-center h-[60px] p-4 bg-white shadow-sm">
      <Logo />
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full p-1 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Welcome</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Dashboard
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          {showAuthButtons && (
            <div className="flex w-fit gap-4 items-center">
              <Link to="/auth/login">
                <Button className="cursor-pointer">Login</Button>
              </Link>
              <Link to="/auth/signup">
                <Button variant="secondary" className="cursor-pointer">
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

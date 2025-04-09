import Logo from "@/components/ui/logo";
import { Link, useMatches } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import { useSession } from "@/hooks/auth";
import UserAvatar from "@/components/layout/userAvatar";


const Header = () => {
  const { session } = useSession();
  const isLoading = useAuthStore((state) => state.loading);
  const matches = useMatches();
  const headerProps = matches.at(-1)?.context?.header || {};
  const { showAuthButtons = true,hideHeader } = headerProps;

  if (isLoading) {
    return <nav className="w-full h-[60px] p-4 bg-white shadow-sm" />;
  }

  if (hideHeader) {
    return <></>;
  }

  return (
    <nav className="w-full flex justify-between items-center h-[60px] p-4 bg-white shadow-sm">
      <Logo />
      {session ? (
        <UserAvatar />
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

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession, useSignOut } from "@/hooks/auth";
import { useNavigate } from "@tanstack/react-router";

const UserAvatar = () => {
  const signOutMutation = useSignOut();
  const { session } = useSession();
  const navigate = useNavigate();

  const userEmail = session?.user?.email || "anonymous@example.com";
  const userInitial = userEmail?.charAt(0)?.toUpperCase();

  const handleSignOut = () => {
    signOutMutation.mutate();
    navigate({
      to: "/",
    });
  };

  return (
    <>
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
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserAvatar;

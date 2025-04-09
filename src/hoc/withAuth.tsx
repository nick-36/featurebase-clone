import React, { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/hooks/auth";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const ComponentWithAuth: React.FC<P> = (props: P) => {
    const { session, isLoading } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !session) {
        navigate({ to: "/auth/login" });
      }
    }, [session, isLoading]);

    if (isLoading) return <div>Loading...</div>;
    if (!session) return null;

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithAuth;
}

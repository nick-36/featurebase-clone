import useAuthStore from "@/stores/authStore";

export function useSession() {
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);

  return {
    session,
    isLoading: loading,
  };
}
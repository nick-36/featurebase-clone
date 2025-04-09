import supabase from "@/config/supabaseClient";
import { queryClient, queryKeys } from "@/lib/queryClient";
import useAuthStore from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      const { data } = await supabase.auth.getSession();
      if (data.session) throw new Error("Session not cleared");

      return true;
    },
    onSuccess: () => {
      console.log("Sign-out success");
      useAuthStore.getState().setSession(null);
    },
    onError: (error) => {
      console.error("Sign-out error:", error);
      useAuthStore.getState().setSession(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
    },
  });
}

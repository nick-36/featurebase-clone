import supabase from "@/config/supabaseClient";
import useAuthStore, { type AuthResult } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";

export function useSignUp() {
    return useMutation({
      mutationFn: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }): Promise<AuthResult> => {
        const { data, error } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password,
        });
        if (error) throw new Error(error.message);
        return { success: true, data };
      },
      onSuccess: (result) => {
        if (result.success && result.data?.session) {
          useAuthStore.getState().setSession(result.data.session);
        }
      },
    });
  }
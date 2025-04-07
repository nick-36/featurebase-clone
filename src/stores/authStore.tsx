import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import supabase from "@/config/supabaseClient";
import { useMutation } from "@tanstack/react-query";
import { queryClient, queryKeys } from "@/lib/queryClient";

interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface AuthState {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
}));

let unsubscribe: (() => void) | undefined;

const initializeAuth = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    useAuthStore.getState().setSession(session);
    useAuthStore.getState().setLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          useAuthStore.getState().setSession(null);
        } else {
          useAuthStore.getState().setSession(session);
        }

        useAuthStore.getState().setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  } catch (error) {
    console.error("Error initializing auth:", error);
    useAuthStore.getState().setSession(null);
    useAuthStore.getState().setLoading(false);
    return () => {};
  }
};

if (typeof window !== "undefined") {
  initializeAuth().then((unsub) => {
    unsubscribe = unsub;
    window.addEventListener("beforeunload", () => {
      if (unsubscribe) unsubscribe();
    });
  });
}

export function useSession() {
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);

  return {
    session,
    isLoading: loading,
  };
}

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

export function useSignIn() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({
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

export default useAuthStore;

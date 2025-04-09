import { create } from "zustand";
import supabase from "@/config/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthResult {
  success: boolean;
  data: {
    session?: Session | null;
    user?: User | null;
  };
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

export default useAuthStore;

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { redirect } from "@tanstack/react-router";
import supabase from "@/config/supabaseClient";
import { ElementsType, QuestionElement } from "@/types/formElement";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkAuth = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export async function requireAuth() {
  const session = await checkAuth();
  if (!session) {
    throw redirect({
      to: "/auth/login",
      search: {
        redirect: location.href,
      },
    });
  }
}

export const isQuestionElement = (
  type: ElementsType
): type is keyof typeof QuestionElement => {
  return Object.values(QuestionElement).includes(type as QuestionElement);
};

export const getBaseURL = () => {
  if (import.meta.env.MODE === "development")
    return import.meta.env.VITE_FRONTEND_DEV_URL;
  if (import.meta.env.MODE === "production")
    return import.meta.env.VITE_FRONTEND_PROD_URL;
  return import.meta.env.VITE_FRONTEND_PREVIEW_URL;
};

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { redirect } from "@tanstack/react-router";
import supabase from "@/config/supabaseClient";
import { ElementsType, QuestionElement } from "@/types/formElement";
import { BarChart3, ClipboardList, LayoutDashboard } from "lucide-react";

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

export const sidebarNavLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
  },
  {
    title: "Surveys",
    href: "/dashboard/surveys",
    icon: ClipboardList,
    id: "surveys",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    id: "analytics",
  },
];

// src/utils/animations.ts
import { Variants } from "framer-motion";

export const cardVariants: Variants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  }),
};

export const questionCardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: index * 0.15,
    },
  }),
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
};

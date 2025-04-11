// src/routes/builder/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import SurveyBuilder from "@/components/builder/builderV2";

export const Route = createFileRoute("/builder/")({
  component: SurveyBuilder,
  loader: async () => {
    return {};
  },
});

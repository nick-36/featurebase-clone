import Hero from "@/components/layout/hero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPageComp,
});

function IndexPageComp() {
  return <Hero />;
}

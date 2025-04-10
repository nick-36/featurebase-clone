import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/auth";
import { useNavigate } from "@tanstack/react-router";

const Hero = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  const onGetStartedClick = () => {
    if (session) {
      navigate({ to: "/dashboard" });
    } else {
      navigate({ to: "/auth/login", search: { redirectTo: "/" } });
    }
  };

  return (
    <section className="h-[640px] flex items-center justify-center  text-white text-center px-6 bg-gradient-to-br from-slate-500 to-indigo-600">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Run surveys to measure customer satisfaction & capture feedback
        </h1>
        <p className="mt-4 text-lg md:text-xl opacity-90">
          Create and share surveys easily to gather valuable insights.
        </p>
        <Button
          onClick={onGetStartedClick}
          className="mt-6 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default Hero;

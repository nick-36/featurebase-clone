import { Link } from "@tanstack/react-router";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex gap-2 items-center font-bold text-3xl bg-gradient-to-r from-indigo-400 to-slate-400 text-transparent bg-clip-text hover:cursor-pointer mix-blend-multiply"
    >
      <p className="text-xl font-semibold">SurveyBase</p>
    </Link>
  );
};

export default Logo;

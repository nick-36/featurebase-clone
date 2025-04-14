import { Input } from "@/components/ui/input";
import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

const QuestionLink = ({
  id,
  value,
  placeholder,
  onChange,
  isInvalid,
}: Props) => {
  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "https://example.com"}
        className={cn("pl-9", isInvalid && "border-red-500")}
      />
      <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
    </div>
  );
};

export default QuestionLink;

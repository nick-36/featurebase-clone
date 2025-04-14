import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

const QuestionText = ({
  id,
  value,
  placeholder,
  maxLength,
  onChange,
  isInvalid,
}: Props) => {
  return (
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={cn(isInvalid && "border-red-500")}
    />
  );
};

export default QuestionText;

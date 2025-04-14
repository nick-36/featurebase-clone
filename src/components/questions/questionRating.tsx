import { Button } from "../ui/button";

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QuestionRating = ({ value, placeholder, onChange }: Props) => {
  return (
    <div className="flex gap-2">
      {Array.from({
        length: parseInt(placeholder || "5"),
      }).map((_, i) => (
        <Button
          key={i}
          variant={
            (value as string) === (i + 1).toString() ? "default" : "outline"
          }
          className="h-8 w-8 rounded border border-gray-300 flex items-center justify-center text-sm"
          onClick={(e) => {
            console.log(value, "ID");
            e.preventDefault();
            const selectedVal = (i + 1).toString();
            onChange(selectedVal);
          }}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
};

export default QuestionRating;

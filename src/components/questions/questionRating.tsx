interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QuestionRating = ({ placeholder }: Props) => {
  return (
    <div className="flex gap-2">
      {Array.from({
        length: parseInt(placeholder || "5"),
      }).map((_, i) => (
        <div
          key={i}
          className="h-8 w-8 rounded border border-gray-300 flex items-center justify-center text-sm"
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default QuestionRating;

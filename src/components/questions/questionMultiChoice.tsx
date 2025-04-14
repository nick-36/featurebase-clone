import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuestionChoice } from "@/types/survey";

interface Props {
  id: string;
  value: string;
  choices: QuestionChoice[];
  onChange: (value: string) => void;
}

const QuestionMultiChoice = ({ id, value, choices, onChange }: Props) => {
  const [mode, _] = useState<"single" | "multiple">("multiple");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(value.split(",").filter(Boolean));
  }, [value]);

  const handleSingleChange = (val: string) => {
    setSelected([val]);
    onChange(val);
  };

  const handleMultiChange = (val: string, checked: boolean) => {
    const updated = checked
      ? [...selected, val]
      : selected.filter((v) => v !== val);
    setSelected(updated);
    onChange(updated.join(","));
  };

  return (
    <div className="space-y-4">
      {/* <div className="flex gap-2">
        <Button
          variant={mode === "single" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("single")}
        >
          Single Choice
        </Button>
        <Button
          variant={mode === "multiple" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("multiple")}
        >
          Multiple Choice
        </Button>
      </div> */}

      {mode === "single" ? (
        <RadioGroup
          value={selected[0] || ""}
          onValueChange={handleSingleChange}
        >
          {choices.map((choice) => (
            <div key={choice.id} className="flex items-center gap-2">
              <RadioGroupItem value={choice.value} id={`${id}-${choice.id}`} />
              <Label htmlFor={`${id}-${choice.id}`}>{choice.label}</Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        choices.map((choice) => (
          <div key={choice.id} className="flex items-center gap-2">
            <Checkbox
              id={`${id}-${choice.id}`}
              checked={selected.includes(choice.value)}
              onCheckedChange={(checked) =>
                handleMultiChange(choice.value, checked as boolean)
              }
            />
            <Label htmlFor={`${id}-${choice.id}`}>{choice.label}</Label>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionMultiChoice;

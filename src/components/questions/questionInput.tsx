"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionType } from "@/types/survey";

import QuestionText from "@/components/questions/questionText";
import QuestionMultiChoice from "@/components/questions/questionMultiChoice";
import QuestionRating from "@/components/questions/questionRating";
import QuestionLink from "@/components/questions/questionLink";
import { QuestionChoice } from "@/types/survey";

export interface QuestionInputProps {
  id: string;
  label: string;
  type: QuestionType;
  value: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  choices?: QuestionChoice[];
  ratingScale?: number;
  className?: string;
  isInvalid?: boolean;
  onChange: (value: string) => void;
  onDeleteQuestion?: () => void;
  isDisabled?: boolean;
  description?: string;
}

export const QuestionInput = ({
  id,
  label,
  type,
  value,
  placeholder,
  required = false,
  maxLength,
  choices = [],
  className,
  isInvalid = false,
  onChange,
  onDeleteQuestion,
  isDisabled = false,
  description,
}: QuestionInputProps) => {
  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Label htmlFor={id} className="text-sm text-gray-700 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {onDeleteQuestion && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            disabled={isDisabled}
            onClick={onDeleteQuestion}
          >
            <Trash2 className="h-4 w-4 text-slate-400" />
          </Button>
        )}
      </div>

      {type === "text" && (
        <QuestionText
          id={id}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={onChange}
          isInvalid={isInvalid}
        />
      )}

      {type === "multiChoice" && (
        <QuestionMultiChoice
          id={id}
          value={value}
          choices={choices}
          onChange={onChange}
        />
      )}

      {type === "rating" && (
        <QuestionRating
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}

      {type === "link" && (
        <QuestionLink
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          isInvalid={isInvalid}
        />
      )}

      {isInvalid && (
        <p className="text-xs text-red-500">This field is required</p>
      )}
    </div>
  );
};

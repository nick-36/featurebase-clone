// src/components/survey-builder/QuestionPreview.tsx
import { motion } from "framer-motion";
import { QuestionInput } from "@/components/questions/questionInput";
import { Question } from "@/types/survey";
import { questionCardVariants } from "@/lib/utils";

interface QuestionPreviewProps {
  question: Question;
  index: number;
}

export function QuestionPreview({ question, index }: QuestionPreviewProps) {
  const choices = (question.options || []).map((opt, idx) => ({
    id: `${idx}`,
    value: opt,
    label: opt,
  }));

  return (
    <motion.div
      custom={index}
      variants={questionCardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <QuestionInput
        id={question.id}
        label={question.title || `Question ${index + 1}`}
        type={question.type as any}
        value=""
        placeholder={question.placeholder}
        required={question.required}
        choices={choices}
        ratingScale={question.placeholder ? parseInt(question.placeholder) : 5}
        onChange={() => {}}
        description={question.description}
      />
    </motion.div>
  );
}

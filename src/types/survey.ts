// types.ts
export type NextAction = "nextPage" | "endSurvey";

export interface Question {
  id: string;
  type: string;
  title: string;
  description: string;
  placeholder: string;
  required: boolean;
  nextAction: NextAction;
  options?: string[];
}

export interface SurveyPage {
  id: string;
  questions: Question[];
}

export interface BaseSurvey {
  id?: string;
  title: string;
  description: string | null;
  is_published?: boolean;
}

export interface SurveyParsed extends BaseSurvey {
  pages: SurveyPage[];
}

export interface SurveyResponse {
  questionId: string;
  answer: string | string[];
}

export type SurveyWithStats = SurveyParsed & {
  bounceRate: number;
  submissionRate: number;
  visits: number;
  submissions: number;
};

export type QuestionType = "text" | "multiChoice" | "rating" | "link";

export type QuestionChoice = {
  id: string;
  label: string;
  value: string;
};

export type DeviceView = "desktop" | "tablet" | "mobile";

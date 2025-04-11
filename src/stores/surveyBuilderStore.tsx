// types.ts
export interface Question {
  id: string;
  type: string;
  title: string;
  description: string;
  placeholder: string;
  required: boolean;
  nextAction: string;
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

// surveyStore.ts
import { create } from "zustand";

interface SurveyState {
  survey: SurveyParsed;
  activePageIndex: number;
  activeView: "edit" | "preview";

  // Methods
  setSurvey: (survey: SurveyParsed) => void;
  setActivePageIndex: (index: number) => void;
  setActiveView: (view: "edit" | "preview") => void;
  updateSurveyMeta: <K extends keyof BaseSurvey>(
    field: K,
    value: BaseSurvey[K]
  ) => void;
  addPage: () => void;
  deletePage: (pageIndex: number) => void;
  addQuestion: (pageIndex: number) => void;
  deleteQuestion: (pageIndex: number, questionIndex: number) => void;
  updateQuestion: (
    pageIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: any
  ) => void;
  addOption: (pageIndex: number, questionIndex: number) => void;
  updateOption: (
    pageIndex: number,
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => void;
  deleteOption: (
    pageIndex: number,
    questionIndex: number,
    optionIndex: number
  ) => void;
  navigatePreview: (direction: "next" | "prev") => void;
}

// Helper function to create an empty survey
export const getEmptySurvey = (): SurveyParsed => ({
  title: "Untitled Survey",
  description: "",
  pages: [
    {
      id: crypto.randomUUID(),
      questions: [
        {
          id: crypto.randomUUID(),
          type: "text",
          title: "Question 1",
          description: "",
          placeholder: "Enter your answer",
          required: false,
          nextAction: "nextPage",
        },
      ],
    },
  ],
  is_published: false,
});

export const useSurveyBuilder = create<SurveyState>((set) => ({
  survey: getEmptySurvey(),
  activePageIndex: 0,
  activeView: "edit",

  // Set the entire survey
  setSurvey: (newSurvey) => set({ survey: newSurvey }),

  // Set active page index
  setActivePageIndex: (index) => set({ activePageIndex: index }),

  // Set active view (edit or preview)
  setActiveView: (view) => set({ activeView: view }),

  // Update survey metadata
  updateSurveyMeta: (field, value) =>
    set((state) => ({
      survey: {
        ...state.survey,
        [field]: value,
      },
    })),

  // Add a new page
  addPage: () =>
    set((state) => {
      const newPage: SurveyPage = {
        id: crypto.randomUUID(),
        questions: [
          {
            id: crypto.randomUUID(),
            type: "text",
            title: `Question ${state.survey.pages.length + 1}`,
            description: "",
            placeholder: "Enter your answer",
            required: false,
            nextAction: "nextPage",
          },
        ],
      };

      return {
        survey: {
          ...state.survey,
          pages: [...state.survey.pages, newPage],
        },
        activePageIndex: state.survey.pages.length,
      };
    }),

  // Delete a page
  deletePage: (pageIndex) =>
    set((state) => {
      // Don't delete if it's the only page
      if (state.survey.pages.length <= 1) return state;

      const updatedPages = [...state.survey.pages];
      updatedPages.splice(pageIndex, 1);

      return {
        survey: {
          ...state.survey,
          pages: updatedPages,
        },
        activePageIndex:
          pageIndex <= state.activePageIndex
            ? Math.max(0, state.activePageIndex - 1)
            : state.activePageIndex,
      };
    }),

  // Add a question to a page
  addQuestion: (pageIndex) =>
    set((state) => {
      const updatedPages = [...state.survey.pages];
      const currentQuestions = updatedPages[pageIndex].questions;

      updatedPages[pageIndex].questions = [
        ...currentQuestions,
        {
          id: crypto.randomUUID(),
          type: "text",
          title: `Question ${currentQuestions.length + 1}`,
          description: "",
          placeholder: "Enter your answer",
          required: false,
          nextAction: "nextPage",
        },
      ];

      return {
        survey: {
          ...state.survey,
          pages: updatedPages,
        },
      };
    }),

  // Delete a question
  deleteQuestion: (pageIndex, questionIndex) =>
    set((state) => {
      // Don't delete if it's the only question
      if (state.survey.pages[pageIndex].questions.length <= 1) return state;

      const updatedPages = [...state.survey.pages];
      updatedPages[pageIndex].questions.splice(questionIndex, 1);

      return {
        survey: {
          ...state.survey,
          pages: updatedPages,
        },
      };
    }),

  // Update a question
  updateQuestion: (pageIndex, questionIndex, field, value) =>
    set((state) => {
      const updatedPages = [...state.survey.pages];
      updatedPages[pageIndex].questions[questionIndex] = {
        ...updatedPages[pageIndex].questions[questionIndex],
        [field]: value,
      };

      return {
        survey: {
          ...state.survey,
          pages: updatedPages,
        },
      };
    }),

  // Add an option to a multi-choice question
  addOption: (pageIndex, questionIndex) =>
    set((state) => {
      const updatedPages = [...state.survey.pages];
      const currentQuestion = updatedPages[pageIndex].questions[questionIndex];

      if (!currentQuestion.options) {
        currentQuestion.options = [];
      }

      currentQuestion.options.push(
        `Option ${(currentQuestion.options.length || 0) + 1}`
      );

      return {
        survey: {
          ...state.survey,
          pages: updatedPages,
        },
      };
    }),

  // Update an option in a multi-choice question
  updateOption: (pageIndex, questionIndex, optionIndex, value) =>
    set((state) => {
      const updatedPages = [...state.survey.pages];
      const currentQuestion = updatedPages[pageIndex].questions[questionIndex];

      if (currentQuestion.options) {
        currentQuestion.options[optionIndex] = value;

        return {
          survey: {
            ...state.survey,
            pages: updatedPages,
          },
        };
      }

      return state;
    }),

  // Delete an option from a multi-choice question
  deleteOption: (pageIndex, questionIndex, optionIndex) =>
    set((state) => {
      const updatedPages = [...state.survey.pages];
      const currentQuestion = updatedPages[pageIndex].questions[questionIndex];

      if (currentQuestion.options && currentQuestion.options.length > 1) {
        currentQuestion.options.splice(optionIndex, 1);

        return {
          survey: {
            ...state.survey,
            pages: updatedPages,
          },
        };
      }

      return state;
    }),

  navigatePreview: (direction: "next" | "prev") =>
    set((state) => {
      if (
        direction === "next" &&
        state.activePageIndex < state.survey.pages.length - 1
      ) {
        return { activePageIndex: state.activePageIndex + 1 };
      } else if (direction === "prev" && state.activePageIndex > 0) {
        return { activePageIndex: state.activePageIndex - 1 };
      }
      return state;
    }),
}));

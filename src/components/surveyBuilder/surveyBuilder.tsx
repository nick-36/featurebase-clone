import { useEffect } from "react";
import { SurveyMetadataEditor } from "./surveyMetaDataEditor";
import { PageManager } from "./pageManager";
import { PreviewPane } from "./previewPanel";
import { Toolbar } from "./toolbar";
import { useSurveyBuilder } from "@/stores/surveyBuilderStore";
import {
  NextAction,
  QuestionType,
  SurveyParsed,
  SurveyWithStats,
} from "@/types/survey";

const getInitialPages = () => {
  return [
    {
      id: crypto.randomUUID(),
      questions: [
        {
          id: crypto.randomUUID(),
          type: "text" as QuestionType,
          title: "Question 1",
          description: "",
          placeholder: "Enter your answer",
          required: false,
          nextAction: "nextPage" as NextAction,
        },
      ],
    },
  ];
};

export default function SurveyBuilder({
  surveyData,
}: {
  surveyData?: SurveyParsed;
}) {
  const { survey, setSurvey } = useSurveyBuilder();

  useEffect(() => {
    if (!surveyData || !surveyData.id) return;

    const hasPages =
      Array.isArray(surveyData.pages) && surveyData.pages.length > 0;
    if (!hasPages) {
      const { bounceRate, submissionRate, submissions, visits, ...rest } =
        surveyData as SurveyWithStats;
      const newSurvey: SurveyParsed = {
        ...rest,
        pages: getInitialPages(),
      };

      setSurvey(newSurvey);
    } else {
      setSurvey(surveyData);
    }
  }, [surveyData, setSurvey]);

  return (
    <div className="mx-4 py-4 px-0 md:px-2">
      <Toolbar surveyId={survey.id} />
      <div className="relative flex gap-2 h-screen overflow-hidden">
        <div className="w-full md:w-1/2 overflow-y-auto bg-slate-50">
          <SurveyMetadataEditor />
          <PageManager />
        </div>
        <PreviewPane className="w-1/2 overflow-y-auto" />
      </div>
    </div>
  );
}

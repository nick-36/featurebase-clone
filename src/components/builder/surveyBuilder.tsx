import { Suspense, lazy, useEffect, useState } from "react";
// import PreviewDialogBtn from "@/components/builder/previewDialogBtn";
// import SaveFormBtn from "./saveFormBtn";
// import PublishFormBtn from "./publishFormBtn";
// import Designer from "@/components/builder/designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useBuilder } from "@/stores/builderStore";
import { PendingSkeleton } from "@/components/layout/loadingSkeleton";

const PreviewDialogBtn = lazy(
  () => import("@/components/builder/previewDialogBtn")
);
const SaveFormBtn = lazy(() => import("./saveFormBtn"));
const PublishFormBtn = lazy(() => import("./publishFormBtn"));
const Designer = lazy(() => import("@/components/builder/designer"));
const DragOverlayWrapper = lazy(() => import("./dragOverlayWrapper"));

const SurveyBuilder = ({ survey }: { survey: Survey }) => {
  const { setElements, onSelectElement, elements } = useBuilder(
    (state) => state
  );
  const [isReady, setIsReady] = useState(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (isReady) return;
    const elements =
      typeof survey.content === "string" && survey.content.length > 1
        ? JSON.parse(survey.content)
        : Array.isArray(survey.content)
          ? survey.content
          : [];

    setElements(elements);
    onSelectElement(null);
    const readyTimeOut = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeOut);
  }, [survey, isReady, setElements, onSelectElement]);

  if (!isReady) {
    return <PendingSkeleton />;
  }

  return (
    <DndContext sensors={sensors}>
      <main className="w-full h-full flex flex-col min-h-screen">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Survey:</span>
            {survey?.name}
          </h2>
          <div className="flex items-center gap-2">
            <Suspense fallback={<div>Loading preview...</div>}>
              <PreviewDialogBtn />
            </Suspense>
            {!survey?.published && (
              <>
                <SaveFormBtn />
                <PublishFormBtn
                  surveyId={survey?.id}
                  isPublishable={elements.length > 0}
                />
              </>
            )}
          </div>
        </nav>
        <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)]">
          <Suspense
            fallback={
              <div className="p-6 text-muted-foreground">
                Loading builder...
              </div>
            }
          >
            <Designer />
          </Suspense>
        </div>
      </main>
      <Suspense fallback={null}>
        <DragOverlayWrapper />
      </Suspense>
    </DndContext>
  );
};

export default SurveyBuilder;

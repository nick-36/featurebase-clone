import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Laptop,
  MonitorCheck,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionPreview } from "./questionPreview";
import { useSurveyBuilder } from "@/stores/surveyBuilderStore";
import { cardVariants } from "@/lib/utils";

interface PreviewPaneProps {
  className?: string;
}

export function PreviewPane({ className }: PreviewPaneProps) {
  const {
    survey,
    activePageIndex,
    activeView,
    setActiveView,
    deviceView,
    setDeviceView,
    navigatePreview,
  } = useSurveyBuilder();
  const [direction] = useState(1);

  const getDeviceWidthClass = () => {
    switch (deviceView) {
      case "mobile":
        return "w-full max-w-xs";
      case "tablet":
        return "w-full max-w-md";
      default:
        return "w-full max-w-2xl";
    }
  };

  return (
    <div
      className={cn(
        "group hidden flex-1 flex-shrink-0 flex-col md:flex h-screen overflow-hidden border-l border-slate-200 pl-2",
        className
      )}
    >
      <div className="flex flex-col h-full w-full">
        <div className="h-full border border-gray-300 rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-700 rounded-md px-3 py-1 text-sm text-center truncate">
                {survey.title || "Untitled Survey"} • Preview
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1 bg-gray-700 rounded-md p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 h-6 ${deviceView === "desktop" ? "bg-gray-600" : ""}`}
                  onClick={() => setDeviceView("desktop")}
                >
                  <MonitorCheck className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 h-6 ${deviceView === "tablet" ? "bg-gray-600" : ""}`}
                  onClick={() => setDeviceView("tablet")}
                >
                  <Laptop className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 h-6 ${deviceView === "mobile" ? "bg-gray-600" : ""}`}
                  onClick={() => setDeviceView("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              {activeView === "preview" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView("edit")}
                  className="h-6 text-xs"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" /> Editor
                </Button>
              )}
            </div>
          </div>

          <div className="bg-white  shadow-md flex-1 overflow-y-auto p-4">
            <div
              className={`${getDeviceWidthClass()} mx-auto transition-all duration-300 h-full`}
            >
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={activePageIndex}
                  custom={direction}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-full flex flex-col"
                >
                  <div className="p-6 space-y-6 flex-1">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {survey.title || "Untitled Survey"}
                      </h2>
                      {survey.description && (
                        <p className="text-gray-600">{survey.description}</p>
                      )}
                    </div>
                    <Separator className="bg-gray-200" />
                    <div className="space-y-4">
                      {survey.pages[activePageIndex]?.questions.map(
                        (question, index) => (
                          <QuestionPreview
                            key={question.id}
                            question={question}
                            index={index}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <Separator className="bg-gray-200 my-4" />
                  <div className="p-6 pt-2 flex justify-between items-center flex-shrink-0">
                    {activePageIndex > 0 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigatePreview("prev")}
                        className="px-4 py-2 rounded border border-gray-300 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </motion.button>
                    ) : (
                      <div />
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        activePageIndex < survey.pages.length - 1
                          ? navigatePreview("next")
                          : console.log("Survey submitted")
                      }
                      className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      {activePageIndex < survey.pages.length - 1 ? (
                        <>
                          Next <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        "Submit"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-gray-200 border-t border-gray-300 px-4 py-2 flex items-center justify-between text-xs text-gray-600 flex-shrink-0">
            <div>
              Page {activePageIndex + 1} of {survey.pages.length}
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Preview Mode
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

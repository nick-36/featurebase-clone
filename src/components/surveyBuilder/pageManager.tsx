// src/components/survey-builder/PageManager.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { QuestionList } from "@/components/surveyBuilder/questionList";
import { useSurveyBuilder } from "@/stores/surveyBuilderStore";

export function PageManager() {
  const { survey, activePageIndex, setActivePageIndex, addPage, deletePage } =
    useSurveyBuilder();

  return (
    <Card className="shadow-sm mt-4 ">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
        <CardTitle className="text-lg">Survey Pages</CardTitle>
        <Button onClick={addPage} size="sm" variant="outline" className="h-8">
          <Plus className="h-4 w-4 mr-1" /> Add Page
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs
          value={activePageIndex.toString()}
          onValueChange={(value) => setActivePageIndex(parseInt(value))}
          className="w-full"
        >
          <div className="flex items-center mb-4">
            <div className="overflow-x-auto flex-1 scrollbar-hide">
              <TabsList className="w-max inline-flex">
                {survey.pages.map((page, index) => (
                  <TabsTrigger
                    key={page.id}
                    value={index.toString()}
                    className="text-sm whitespace-nowrap"
                  >
                    Page {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {survey.pages.map((page, pageIndex) => (
            <TabsContent key={page.id} value={pageIndex.toString()}>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">
                    Page {pageIndex + 1} of {survey.pages.length}
                  </h3>
                  <Button
                    onClick={() => deletePage(pageIndex)}
                    size="sm"
                    variant="destructive"
                    disabled={survey.pages.length <= 1}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Page
                  </Button>
                </div>
                <QuestionList pageIndex={pageIndex} />
                <Button
                  onClick={() => addPage()}
                  variant="outline"
                  className="w-full group hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Add Page
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Share2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getBaseURL } from "@/lib/utils";

type SurveyCardProps = {
  id: string;
  name: string | null;
  description?: string | null;
  shareURL: string | null;
  createdAt: string;
  isPublished: boolean;
  responseCount: number;
};

const SurveyCard: React.FC<SurveyCardProps> = ({
  id,
  name,
  description,
  shareURL,
  createdAt,
  isPublished,
  responseCount,
}) => {
  const handleShare = () => {
    const url = `${getBaseURL()}/submit/${shareURL}`;
    navigator.clipboard.writeText(url);
    toast.success("Survey URL copied to clipboard!");
  };

  return (
    <Card
      className="w-full min-h-[200px] transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01]
      bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200/50 pb-0 cursor-pointer"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-800">
            {name}
          </CardTitle>
          <Badge
            className={
              isPublished
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }
            variant="outline"
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
        <CardDescription className="text-gray-600 line-clamp-2">
          {description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="border-t pt-3 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center text-xs text-muted-foreground">
            <div>
              Created on {new Date(createdAt).toLocaleDateString()}{" "}
              {isPublished && (
                <>
                  | {responseCount} response{responseCount !== 1 ? "s" : ""}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-end">
            {isPublished ? (
              <>
                <Button
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                  size="sm"
                  asChild
                >
                  <Link to="/surveys/$surveyId" params={{ surveyId: id }}>
                    See Details
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 cursor-pointer" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="cursor-pointer"
                size="sm"
                asChild
              >
                <Link to="/surveys/$surveyId/builder" params={{ surveyId: id }}>
                  <Pencil className="w-4 h-4 cursor-pointer" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyCard;

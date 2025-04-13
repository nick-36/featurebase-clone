import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Share2, Pencil, Info, Calendar, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getBaseURL } from "@/lib/utils";

type SurveyCardProps = {
  id: string;
  name: string | null;
  description?: string | null;
  shareURL: string | null;
  createdAt: string | null;
  isPublished: boolean | null;
  responseCount: number | null;
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

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "";

  return (
    <Card
      className="w-full h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01]
      bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200/50 flex flex-col"
    >
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-md sm:text-lg font-semibold text-blue-800 line-clamp-1">
            {name}
          </CardTitle>
          <Badge
            className={`shrink-0 text-xs px-2 py-1 mt-1 ${
              isPublished
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
            variant="outline"
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
        <CardDescription className="text-gray-600 text-xs sm:text-sm line-clamp-2 mt-2">
          {description || "No description provided."}
        </CardDescription>
      </CardHeader>

      <CardContent className="border-t border-blue-100 pt-3 pb-0 flex-grow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1.5 text-blue-500" />
            <span>{formattedDate}</span>
          </div>

          {isPublished && responseCount !== null && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MessageSquare className="w-3 h-3 mr-1.5 text-blue-500" />
              <span>
                {responseCount} response{responseCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-3 mt-auto flex justify-end items-center gap-2">
        {isPublished ? (
          <>
            <Button
              variant="secondary"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer h-8 text-xs sm:text-sm"
              size="sm"
              asChild
            >
              <Link to="/surveys/$surveyId" params={{ surveyId: id }}>
                <Info className="w-3.5 h-3.5 mr-1.5" />
                <span>See Details</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer h-8 flex items-center justify-center text-xs sm:text-sm"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="ml-1.5 sm:ml-0 hidden sm:inline">Share</span>
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="cursor-pointer h-8 flex items-center justify-center text-xs sm:text-sm"
            size="sm"
            asChild
          >
            <Link to="/builder/$surveyId" params={{ surveyId: id }}>
              <Pencil className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="ml-1.5 sm:ml-0 hidden sm:inline">Edit</span>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SurveyCard;

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getBaseURL } from "@/lib/utils";

const SurveyLinkShare = ({ shareURl }: { shareURl: string | null }) => {
  const shareLink = `${getBaseURL()}/submit/${shareURl}`;

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <Input
        value={shareLink}
        readOnly
        className="w-full sm:w-auto sm:min-w-[300px] md:min-w-[400px] lg:min-w-[600px] max-w-full"
      />
      <Button
        className="shrink-0 min-w-[200px] cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(shareLink);
          toast.success("Link copied to clipboard");
        }}
      >
        Share Link <Copy className="mr-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default SurveyLinkShare;

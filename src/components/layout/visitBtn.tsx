import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";

const   VisitBtn = ({ shareURl }: { shareURl: string | null }) => {
  const shareLink = `/submit/${shareURl}`;
  return (
    <div className="flex">
      <Button
        className={"w-auto min-w-[200px] cursor-pointer"}
        onClick={() => {
          window.open(shareLink, "_blank");
        }}
      >
        Visit <SquareArrowOutUpRight />
      </Button>
    </div>
  );
};

export default VisitBtn;

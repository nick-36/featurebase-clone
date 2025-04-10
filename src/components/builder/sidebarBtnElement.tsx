import { type FormElement } from "@/types/formElement";
import { Button } from "@/components/ui/button";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

const SidebarBtnElement = ({ formElement }: { formElement: FormElement }) => {
  const { label, icon: Icon } = formElement.designerBtnElement;
  const draggable = useDraggable({
    id: `disigner-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      variant={"outline"}
      className={cn(
        "flex flex-col gap-2 h-[120px] w-[120px] [&_svg]:size-5 cursor-grab",
        draggable.isDragging && "ring-2 ring-primary"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
};

export const SidebarBtnElementDragOverlay = ({
  formElement,
}: {
  formElement: FormElement;
}) => {
  const { label, icon: Icon } = formElement.designerBtnElement;

  return (
    <Button
      variant={"outline"}
      className={"flex flex-col gap-2 h-[120px] w-[120px]"}
    >
      <Icon className="text-primary h-8 w-8 cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
};

export default SidebarBtnElement;

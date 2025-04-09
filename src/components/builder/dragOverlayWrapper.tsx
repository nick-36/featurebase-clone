import { useDndMonitor, DragOverlay, Active } from "@dnd-kit/core";
import { useState } from "react";
import { SidebarBtnElementDragOverlay } from "@/components/builder/sidebarBtnElement";
import { FormElements } from "@/components//builder/formElements";
import { type ElementsType } from "@/types/formElement";
import { useBuilder } from "@/stores/builderStore";

const DragOverlayWrapper = () => {
  const elements = useBuilder((state) => state.elements);
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (e) => {
      setDraggedItem(e.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) null;

  let node = <div>No Drag Overlay</div>;
  const isSidebarBtnElement = draggedItem?.data?.current?.isDesignerBtnElement;

  if (isSidebarBtnElement) {
    const type = draggedItem.data?.current?.type as ElementsType;
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  }
  const isDesignerElement = draggedItem?.data?.current?.isDesignerElement;

  if (isDesignerElement) {
    const elementId = draggedItem.data?.current?.elementId;
    const element = elements.find((el) => el.id === elementId);
    if (!element) {
      node = <div>Element Not Found</div>;
    } else {
      const DesignerElComponent =
        FormElements[element?.type as ElementsType].designerComponent;
      node = (
        <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-2 opacity-80 pointer-events-none">
          <DesignerElComponent elementInstance={element} />
        </div>
      );
    }
  }
  return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;

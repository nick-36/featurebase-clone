import { useState } from "react";
import DesignerSideBar from "@/components/builder/designerSidebar";
import PropertiesSidebar from "@/components/builder/propertiesSidebar";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { FormElements } from "@/components/builder/formElements";
import {
  type ElementsType,
  type FormElementInstance,
} from "@/types/formElement";
import { useBuilder } from "@/stores/builderStore";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Designer = () => {
  const { elements, addElement, onSelectElement, removeElement } = useBuilder(
    (state) => state
  );
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd(event) {
      const { active, over } = event;

      if (!active || !over) return;

      const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        over?.data?.current?.isDesignerDropArea;
      const isDraggingOverDesignerElTopHalf =
        over?.data?.current?.isTopHalfDesignerEl;
      const isDraggingOverDesignerElBottomHalf =
        over?.data?.current?.isBottomHalfDesignerEl;
      const isDroppingOverDesignerEl =
        isDraggingOverDesignerElTopHalf || isDraggingOverDesignerElBottomHalf;

      //CASE-1
      if (isDesignerBtnElement && isDroppingOverDesignerDropArea) {
        //dropping sidebar element over drop-zone area
        const type = active?.data?.current?.type as ElementsType;
        const newElement = FormElements[type].construct(uuidv4());

        addElement(elements.length, newElement);
      }
      //CASE-2
      const droppingSidebarBtnElOverDesignerEl =
        isDesignerBtnElement && isDroppingOverDesignerEl;

      if (droppingSidebarBtnElOverDesignerEl) {
        const type = active?.data?.current?.type as ElementsType;
        const newElement = FormElements[type].construct(uuidv4());
        const overId = over?.data?.current?.elementId;

        const overElementIndex = elements.findIndex((el) => el.id === overId);

        if (overElementIndex === -1) {
          throw new Error("Element Not Found!");
        }
        let indexForNewElement = overElementIndex;
        if (isDraggingOverDesignerElBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, newElement);
      }

      //CASE-3
      const isDroppingDesignerEl = active?.data?.current?.isDesignerElement;
      const isDroppingDesignerElOverAnotherDesignerEl =
        isDroppingOverDesignerEl && isDroppingDesignerEl;

      if (isDroppingDesignerElOverAnotherDesignerEl) {
        const activeId = active?.data?.current?.elementId;
        const overId = over?.data?.current?.elementId;

        const activeElIndex = elements?.findIndex((el) => el?.id === activeId);
        const overElIndex = elements?.findIndex((el) => el?.id === overId);

        if (activeElIndex === -1 || overElIndex === -1) {
          throw new Error("Element not found!");
        }
        const activeEl = { ...elements[activeElIndex] };

        removeElement(activeId);

        let indexForNewElement = overElIndex;
        if (isDraggingOverDesignerElBottomHalf) {
          indexForNewElement = overElIndex + 1;
        }

        addElement(indexForNewElement, activeEl);
      }
    },
  });

  return (
    <div className="w-full h-full flex">
      <div className="w-full grid grid-cols-[320px_1fr_320px] gap-2 h-full">
        <div className="h-full overflow-y-auto flex justify-center items-center bg-background">
          <DesignerSideBar />
        </div>

        <div
          className="p-4 h-full overflow-y-auto"
          onClick={(e) => {
            e.stopPropagation();
            onSelectElement(null);
          }}
        >
          <div
            ref={droppable.setNodeRef}
            className={cn(
              "w-full h-full m-auto flex flex-col overflow-y-auto justify-start items-center bg-background rounded-xl",
              droppable.isOver && "ring-2 ring-primary ring-inset"
            )}
          >
            {!droppable.isOver && elements.length === 0 && (
              <p className="text-3xl text-muted-foreground flex flex-grow items-center justify-center font-bold">
                Drop Here
              </p>
            )}

            {elements.length > 0 && (
              <div className="flex flex-col w-full gap-2 p-4">
                {elements.map((el) => (
                  <DesignerElementWrapper key={el.id} element={el} />
                ))}
              </div>
            )}
            {droppable.isOver && (
              <div className="p-4 w-full">
                <div className="h-[120px] rounded-md bg-primary/20 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        <div className="h-full overflow-y-auto flex justify-center items-center bg-background">
          <PropertiesSidebar />
        </div>
      </div>
    </div>
  );
};

const DesignerElementWrapper = ({
  element,
}: {
  element: FormElementInstance;
}) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const { removeElement, onSelectElement } = useBuilder((state) => state);

  const topHalf = useDroppable({
    id: element?.id + "-top",
    data: {
      type: element?.type,
      elementId: element?.id,
      isTopHalfDesignerEl: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element?.id + "-bottom",
    data: {
      type: element?.type,
      elementId: element?.id,
      isBottomHalfDesignerEl: true,
    },
  });

  const draggable = useDraggable({
    id: element?.id + "-drag-handler",
    data: {
      type: element?.type,
      elementId: element?.id,
      isDesignerElement: true,
    },
  });
  if (draggable.isDragging) return null;

  const DesignerElement = FormElements[element.type].designerComponent;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="cursor-grab relative h-auto flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset w-full  rounded-t-md"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelectElement(element);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className={cn("absolute w-full h-1/2  rounded-t-md")}
      />
      <div
        ref={bottomHalf.setNodeRef}
        className={cn("absolute w-full h-1/2 bottom-0 rounded-b-md")}
      />
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none bg-primary hover:bg-red-400"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <Trash2 />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm ">
              Click the properties or drag to move
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none"></div>
      )}

      <div
        ref={topHalf?.setNodeRef}
        {...draggable.listeners}
        {...draggable.attributes}
        className={cn(
          "cursor-grab flex w-full h-auto min-h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",
          mouseIsOver && "opacity-30",
          topHalf.isOver && "border-t-3 border-t-foreground",
          bottomHalf.isOver && "border-b-3 border-b-foreground"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none" />
      )}
    </div>
  );
};

export default Designer;

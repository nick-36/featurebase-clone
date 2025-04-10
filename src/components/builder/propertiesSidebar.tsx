import { useBuilder } from "@/stores/builderStore";
import { useEffect, useRef } from "react";
import { FormElements } from "@/components/builder/formElements";
import { type ElementsType } from "@/types/formElement";
import { Button } from "@/components/ui/button";
import { Frown, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const PropertiesSidebar = () => {
  const { selectedElement, onSelectElement, elements } = useBuilder(
    (state) => state
  );
  const prevElementsLength = useRef(elements.length);

  useEffect(() => {
    const prevLength = prevElementsLength.current;
    const currentLength = elements.length;

    if (
      selectedElement &&
      !elements.find((el) => el.id === selectedElement.id)
    ) {
      if (elements.length > 0) {
        onSelectElement(elements[elements.length - 1]);
      } else {
        onSelectElement(null);
      }
    }

    if (currentLength > prevLength) {
      const newElement = elements[currentLength - 1];
      onSelectElement(newElement);
    }

    prevElementsLength.current = currentLength;
  }, [elements, selectedElement, onSelectElement]);

  const PropertiesForm =
    selectedElement &&
    FormElements[selectedElement.type as ElementsType]?.propertiesComponent;

  return (
    <aside className="w-[200px] flex flex-col flex-grow border-l-2 border-muted p-4 bg-background overflow-y-auto h-full max-w-[400px]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/70">
          {selectedElement ? "Element Properties" : ""}
        </p>
        {selectedElement && (
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => onSelectElement(null)}
          >
            <X />
          </Button>
        )}
      </div>
      {selectedElement && <Separator className="mb-4" />}
      {selectedElement && PropertiesForm ? (
        <PropertiesForm elementInstance={selectedElement} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
          <Frown />
          <p className="text-lg font-semibold">No Element Selected</p>
          <p className="text-sm">
            {" "}
            Select a field from the builder to start customizing it.
          </p>
        </div>
      )}
    </aside>
  );
};

export default PropertiesSidebar;

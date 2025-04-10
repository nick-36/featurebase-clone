import { ElementsType, FormElement } from "@/types/formElement";
import { Label } from "@/components/ui/label";

import { TableRowsSplit } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const type: ElementsType = "SeparatorField";

const DesignerComponent = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Separator Field</Label>
      <Separator />
    </div>
  );
};

const PropertiesComponent = () => {
  return (
    <p className="text-sm text-muted-foreground">
      No properties for this element
    </p>
  );
};

const FormComponent = () => {
  return <Separator />;
};

const SeparatorFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerBtnElement: {
    icon: TableRowsSplit,
    label: "Separator Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};

export default SeparatorFieldElement;

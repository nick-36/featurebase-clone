import { FormElements } from "@/components/builder/formElements";
import SidebarBtnElement from "./sidebarBtnElement";
import { Separator } from "@/components/ui/separator";

const DesignerSideBar = () => {
  return (
    <aside className="flex flex-col flex-grow border-l-2 border-muted p-4 bg-background overflow-y-auto h-full max-w-[400px]">
      <p className="text-sm text-foreground/70">Drag and drop elements</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Layout elements
        </p>
        <SidebarBtnElement formElement={FormElements.TitleField} />
        <SidebarBtnElement formElement={FormElements.SubTitleField} />
        <SidebarBtnElement formElement={FormElements.ParagraphField} />
        <SidebarBtnElement formElement={FormElements.SeparatorField} />

        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Question Type
        </p>
        <SidebarBtnElement formElement={FormElements.TextField} />
        <SidebarBtnElement formElement={FormElements.TextAreaField} />
        <SidebarBtnElement formElement={FormElements.SelectField} />
        <SidebarBtnElement formElement={FormElements.CheckboxField} />
        <SidebarBtnElement formElement={FormElements.EmailField} />
        <SidebarBtnElement formElement={FormElements.LinkField} />
        <SidebarBtnElement formElement={FormElements.RatingField} />
      </div>
    </aside>
  );
};

export default DesignerSideBar;

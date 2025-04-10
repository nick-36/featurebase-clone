import { useEffect } from "react";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "@/types/formElement";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBuilder } from "@/stores/builderStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading2 } from "lucide-react";

const type: ElementsType = "SubTitleField";

const extraAttributes = {
  subTitle: "SubTitle Field",
};

export const propertiesSchema = z.object({
  subTitle: z.string().min(2).max(50),
});

export type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const DesignerComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const { subTitle } = element?.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">SubTitle Field</Label>
      <p className="test-lg">{subTitle}</p>
    </div>
  );
};

const PropertiesComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const updateElement = useBuilder((state) => state.updateElement);
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      subTitle: element?.extraAttributes?.subTitle,
    },
  });

  useEffect(() => {
    form.reset(element?.extraAttributes);
    //Form in deps may needs to be added
  }, [element]);

  const applyChange = (values: PropertiesFormSchemaType) => {
    const { subTitle } = values;
    updateElement(element?.id, {
      ...element,
      extraAttributes: {
        subTitle,
      },
    });
  };
  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChange)}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="subTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SubTitle</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget?.blur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

const FormComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const { subTitle } = element?.extraAttributes;

  return <p className="text-lg">{subTitle}</p>;
};

const SubTitleFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Heading2,
    label: "SubTitle Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};

export default SubTitleFieldElement;

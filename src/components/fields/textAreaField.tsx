import { useEffect, useState } from "react";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "@/types/formElement";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBuilder } from "@/stores/builderStore";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/ui/icon";

const type: ElementsType = "TextAreaField";

const extraAttributes = {
  label: "TextArea Field",
  required: false,
  helperText: "helper text",
  placeHolder: "value here..",
  rows: 3,
};

export const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().min(2).max(50),
  required: z.boolean(),
  placeHolder: z.string().max(500),
  rows: z.number().min(1).max(10),
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
  const { label, placeHolder, helperText, required, rows } =
    element?.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full min-h-[120px]">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Textarea rows={rows} readOnly placeholder={placeHolder} disabled />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
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
      label: element?.extraAttributes?.label,
      required: element?.extraAttributes?.required,
      helperText: element?.extraAttributes?.helperText,
      placeHolder: element?.extraAttributes?.placeHolder,
      rows: element?.extraAttributes?.rows,
    },
  });

  useEffect(() => {
    form.reset(element?.extraAttributes);
  }, [element]);

  const applyChange = (values: PropertiesFormSchemaType) => {
    updateElement(element?.id, {
      ...element,
      extraAttributes: {
        ...values,
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget?.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. It will display above the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PlaceHolder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget?.blur();
                  }}
                />
              </FormControl>
              <FormDescription>The placeholder of the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget?.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The helperText of the field.It will display below the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>To mark field required</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
  submitValue,
  isInvalid,
  defaultValue = "",
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(false);
  const element = elementInstance as CustomInstance;
  const { label, placeHolder, helperText, required, rows } =
    element?.extraAttributes;

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Textarea
        rows={rows}
        className={cn(error && "border-red-500")}
        placeholder={placeHolder}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={(e) => {
          if (!submitValue) return;
          const valid = TextAreaFormFieldElement.validate(
            element,
            e.target.value
          );
          setError(!valid);
          if (!valid) return;
          submitValue(element?.id, value);
        }}
        value={value}
      />
      {helperText && (
        <p
          className={cn(
            "text-muted-foreground text-[0.8rem]",
            error && "text-red-500"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

const TextAreaFormFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Icons.textAreaIcon,
    label: "TextArea Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element?.extraAttributes?.required) {
      return currentValue?.length > 0;
    }
    return true;
  },
};

export default TextAreaFormFieldElement;

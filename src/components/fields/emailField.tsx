import { useEffect, useState } from "react";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "@/types/formElement";
import { Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

const type: ElementsType = "EmailField" as ElementsType;

const extraAttributes = {
  label: "Email Address",
  required: false,
  helperText: "We'll never share your email.",
  placeHolder: "you@example.com",
};

export const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().min(2).max(100),
  required: z.boolean(),
  placeHolder: z.string().max(100),
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
  const { label, placeHolder, helperText, required } = element?.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeHolder} />
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
    },
  });

  useEffect(() => {
    form.reset(element?.extraAttributes);
  }, [element]);

  const applyChange = (values: PropertiesFormSchemaType) => {
    updateElement(element?.id, {
      ...element,
      extraAttributes: { ...values },
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
                <Input {...field} />
              </FormControl>
              <FormDescription>Label displayed above the field</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Displayed when field is empty</FormDescription>
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
                <Input {...field} />
              </FormControl>
              <FormDescription>Text shown under the field</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div>
                <FormLabel>Required</FormLabel>
                <FormDescription>Make this field mandatory</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
  const { label, placeHolder, helperText, required } = element?.extraAttributes;

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        className={cn(error && "border-red-500")}
        type="email"
        placeholder={placeHolder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;
          const valid = EmailFieldElement.validate(element, e.target.value);
          setError(!valid);
          if (valid) submitValue(element?.id, value);
        }}
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

const EmailFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Mail,
    label: "Email Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes?.required && !currentValue?.length)
      return false;
    if (currentValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValue))
      return false;
    return true;
  },
};

export default EmailFieldElement;

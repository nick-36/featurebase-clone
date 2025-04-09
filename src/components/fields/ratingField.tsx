import { useEffect, useState } from "react";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "@/types/formElement";
import { Star } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { useBuilder } from "@/stores/builderStore";
import { zodResolver } from "@hookform/resolvers/zod";

const type: ElementsType = "RatingField";

const extraAttributes = {
  label: "Rating",
  helperText: "Rate us out of 5 stars",
  maxRating: 5,
  required: false,
};

export const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().min(2).max(50),
  maxRating: z.number().min(1).max(10),
  required: z.boolean(),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;
type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const DesignerComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const { label, maxRating } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-muted-foreground" />
        ))}
      </div>
    </div>
  );
};

// ⚙️ Properties Config Panel
const PropertiesComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const updateElement = useBuilder((s) => s.updateElement);

  const form = useForm<PropertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: element.extraAttributes,
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element]);

  const applyChange = (values: PropertiesSchemaType) => {
    updateElement(element.id, {
      ...element,
      extraAttributes: values,
    });
  };

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChange)}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4"
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Rating</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  {...field}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center border rounded-lg p-3 shadow-sm">
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
  const [value, setValue] = useState(Number(defaultValue));
  const [hover, setHover] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const element = elementInstance as CustomInstance;
  const { label, helperText, required, maxRating } = element.extraAttributes;

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const handleRate = (rating: number) => {
    setValue(rating);
    if (submitValue) {
      const valid = RatingFieldElement.validate(element, rating.toString());
      setError(!valid);
      if (valid) {
        submitValue(element.id, rating.toString());
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, i) => {
          const index = i + 1;
          return (
            <Star
              key={index}
              className={cn(
                "h-6 w-6 cursor-pointer transition-all",
                index <= (hover ?? value) ? "text-yellow-500" : "text-gray-300"
              )}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleRate(index)}
              aria-label={`Rate ${index}`}
            />
          );
        })}
      </div>
      {helperText && (
        <p
          className={cn(
            "text-muted-foreground text-sm",
            error && "text-red-500"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

const RatingFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Star,
    label: "Rating Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, value) => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return !!value && Number(value) > 0;
    }
    return true;
  },
};

export default RatingFieldElement;

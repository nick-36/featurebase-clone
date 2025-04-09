export enum LayoutElement {
  TitleField = "TitleField",
  SubTitleField = "SubTitleField",
  ParagraphField = "ParagraphField",
  SeparatorField = "SeparatorField",
}

export enum QuestionElement {
  TextField = "TextField",
  TextAreaField = "TextAreaField",
  SelectField = "SelectField",
  CheckboxField = "CheckboxField",
  EmailField = "EmailField",
  LinkField = "LinkField",
  RatingField = "RatingField",
}

export type ElementsType =
  | keyof typeof QuestionElement
  | "TitleField"
  | "SubTitleField"
  | "ParagraphField"
  | "SeparatorField";

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>;
};

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
  type: ElementsType;
  construct: (id: string) => FormElementInstance;
  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  designerBtnElement: {
    icon: React.ElementType;
    label: string;
  };
  formComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementsType = {
  [key in ElementsType]: FormElement;
};

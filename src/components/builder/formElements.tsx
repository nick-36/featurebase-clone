import TextFieldFormElement from "@/components/fields/textField";
import TitleFieldFormElement from "@/components/fields/titleField";
import SubTitleFieldFormElement from "@/components/fields/subTitleField";
import ParagraphFieldFormElement from "@/components/fields/paragraphField";
import SeparatorFieldFormElement from "@/components/fields/separatorField";
import TextAreaFieldFormElement from "@/components/fields/textAreaField";
import SelectFieldFormElement from "@/components/fields/selectField";
import CheckboxFieldFormElement from "@/components/fields/checkBoxField";
import EmailFieldFormElement from "@/components/fields/emailField";
import LinkFieldFormElement from "@/components/fields/linkField";
import RatingFieldFormElement from "@/components/fields/ratingField";
import { FormElementsType } from "@/types/formElement";

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  TextAreaField: TextAreaFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  EmailField: EmailFieldFormElement,
  LinkField: LinkFieldFormElement,
  RatingField: RatingFieldFormElement,
};

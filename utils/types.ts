import * as z from "zod";

export type Questionnaire = {
  id: string;
  name: string;
  description: string;
  form: string;
  formName: string;
};

export type Form = {
  schema: any;
  state: any;
  ui: Record<
    string,
    {
      inputType: string;
      label?: string;
      placeholder?: string;
      options?: string[];
      required?: boolean;
      baseInput?: boolean;
    }
  >;
};

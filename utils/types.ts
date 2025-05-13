import * as z from "zod";

// DB types

export type Questionnaire = {
  id: number;
  name: string;
  description: string;
  form: string;
  formName: string;
  Answers?: Answer[];
};

export type Answer = {
    id: number;
    questionnaireId: number;
    form: string;
    Questionnaire?: Questionnaire;
}

export type Tool = {
  id: number;
  title: string;
  description: string;
  url: string;
  cover: string;
}

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

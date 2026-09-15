import * as z from "zod";

// DB types

export enum ReflectionAnswerGetRecommendations {
 YES = `I'd like some recommendations to reflect on this further`,
 NO = `I'm happy with my answer`
}

export type Lifecycle = {
  id: number;
  title: string;
  description: string;
  introduction: string;
  Reflections?: Reflection[];
};

export type Journal = {
  id: number;
  userId: string;
  title: string;
  lifecycleId: number;
  Lifecycle?: Lifecycle;
};

export type Reflection = {
  id: number;
  title: string;
  // introductory paragraph shown above the question
  context: string;
  // the question the user answers
  description: string;
  considerations: string;
  form: string;
  furtherReflectionForm: string;
  lifecycleId: number;
};

export type ReflectionAnswer = {
  id: number;
  form: string;
  journalId: number;
  reflectionId: number;
  Reflection?: Reflection;
};

export type FurtherReflectionAnswer = {
  id: number;
  form: string;
  journalId: number;
  reflectionId: number;
  Reflection?: Reflection;
};

export type Tool = {
  id: number;
  title: string;
  description: string;
  url: string;
  cover: string;
  tags?: string;
  type?: string;
  form?: string;
  file_upload: boolean;
};
export type Recommendation = {
  id: number;
  questionnaireId: number;
  toolId: number;
  binaryEvaluation: number;
  Reflection?: Reflection;
  Tool?: Tool;
};

export type RecommendationAnswer = {
  id: number;
  journalId: number;
  recommendationId: number;
  form?: string;
  file?: string;
  checked_done: boolean;
  Recommendation?: Recommendation;
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

export type TreeNode = {
  label: string;
  value: string;
  icon?: string;
  defaultExpanded?: boolean;
  children?: TreeNode[];
  trailingIcon?: string;
};

export type LastLifecycle = { 
  reflectionTitle: string;
  lifecycleId: number;
  lifecycleTitle: string;
}
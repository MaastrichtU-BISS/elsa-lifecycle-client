import * as z from "zod";

// DB types

export type Lifecycle = {
  id: number;
  title: string;
  description: string;
  general: string;
  introduction: string;
  Phases?: Phase[];
};

export type Phase = {
  id: number;
  number: number;
  title: string;
  description: string;
  lifecycleId: number;
  Lifecycle?: Lifecycle;
  Reflection?: Reflection;
  Journal?: Journal;
};

export type Reflection = {
  id: number;
  title: string;
  description: string;
  form: string;
  phaseId: number;
  Phase?: Phase;
};

export type Journal = {
  id: number;
  title: string;
  description: string;
  form: string;
  phaseId: number;
  Phase?: Phase;
};

export type ReflectionAnswer = {
  id: number;
  userId: string;
  form: string;
  binaryEvaluation: number;
  reflectionId: number;
  Reflection?: Reflection;
};

export type JournalAnswer = {
  id: number;
  userId: string;
  form: string;
  journalId: number;
  Journal?: Journal;
};

export type Tool = {
  id: number;
  title: string;
  description: string;
  url: string;
  cover: string;
  tags: string;
  type: string;
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
  userId: string;
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

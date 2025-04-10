export type Questionnaire = {
    id: string;
    name: string;
    description: string;
    form: string;
    formName: string;
}

export type Form = {
    fields: Field[];
}

export type Field = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: FieldOption[];
    required?: boolean;
}

export type FieldOption = {
    numberOpt?: {
        default?: number;
        min?: number;
        max?: number;
        float?: boolean;
    },
    textOpt?: {
        default?: string;
        min?: number;
        max?: number;
    },
}
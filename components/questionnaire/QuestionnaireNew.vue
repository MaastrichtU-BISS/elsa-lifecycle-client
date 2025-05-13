<script lang="ts" setup>
import * as z from 'zod';
import { ref } from 'vue';
import type { Questionnaire } from '~/utils/types';

const emit = defineEmits(["create"]);

const newQuestionnaire = ref<Omit<Questionnaire, "id">>({
    name: '',
    description: '',
    form: '',
    formName: ''
});

const schema = z.object({
    name: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    form: z.string().min(1, 'Form is required'),
    formName: z.string().min(1, 'Form name is required')
});

const importTemplate = (event: Event) => {

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            newQuestionnaire.value.form = content;
            newQuestionnaire.value.formName = file.name;
        };
        reader.readAsText(file);
    }
}

const createQuestionnaire = () => {
    emit('create', newQuestionnaire.value);
    newQuestionnaire.value = { name: '', description: '', form: '', formName: '' };
};

</script>

<template>

    <div class="p-4 rounded-lg w-fit mx-auto">
        <UForm :state="newQuestionnaire" :schema="schema" class="space-y-4" @submit="createQuestionnaire">
            <UFormField name="name" label="Name" :required="true">
                <UInput v-model="newQuestionnaire.name" class="w-full" />
            </UFormField>
            <UFormField name="description" label="Description" :required="true">
                <UTextarea v-model="newQuestionnaire.description" class="w-full" />
            </UFormField>
            <UFormField name="form" label="Form" :required="true">
                <UInput type="file" accept=".json" @change="importTemplate" />
            </UFormField>


            <UButton type="submit">Submit</UButton>
        </UForm>
    </div>

</template>
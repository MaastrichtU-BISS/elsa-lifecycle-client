<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui';

import { parseCedar } from '~/utils/parseCedar';

const emits = defineEmits(["onSubmit"]);

const props = defineProps<{
    questionnaire: string;
    answer?: string;
}>();

type Schema = z.output<typeof form.schema>

function getForm() {
    const form = JSON.parse(props.questionnaire);
    let answerForm = undefined
    if (props.answer) {
        answerForm = JSON.parse(props.answer);
    }
    const parsedForm = parseCedar(form, answerForm);
    return parsedForm;
}

const form: Form = await getForm();

const state = reactive<Schema>({
    ...form.state
});

const schema = z.object({
    ...form.schema
});

const onSubmit = (event: FormSubmitEvent<Schema>) => {
    const binEval = binaryEvaluation();
    emits('onSubmit', event.data, binEval);
};

const binaryEvaluation = () => {
    let result = 0;
    Object.values(state).reverse().map((value, index) => {
        result |= (value == "Yes" ? 1 << index : 0);
    });
    return result;
};

</script>

<template>
    <section class="questionnaire flex flex-col gap-4">
        <template v-if="form && schema && state">
            <UForm :schema="schema" :state="state" class="space-y-4 w-full mx-auto" @submit="onSubmit">
                <UFormField 
                    v-for="fieldId in Object.keys(form.schema)" :key="fieldId" :label="form.ui[fieldId]?.label"
                    :name="fieldId" :class="form.ui[fieldId]?.inputType === 'section-break' ? 'font-bold text-xl' : ''">
                    <template v-if="form.ui[fieldId]?.baseInput">
                        <UInput 
                            v-model="state[fieldId]" :type="form.ui[fieldId]?.inputType"
                            :required="form.ui[fieldId]?.required"/>
                    </template>
                    <template v-else-if="form.ui[fieldId].inputType == 'textarea'">
                        <UTextarea v-model="state[fieldId]" autoresize class="w-full"/>
                    </template>
                    <template v-else-if="form.ui[fieldId]?.inputType === 'radio'">
                        <URadioGroup 
                            v-model="state[fieldId]" :items="form.ui[fieldId]?.options"
                            :required="form.ui[fieldId]?.required" />
                    </template>
                    <template v-else-if="form.ui[fieldId]?.inputType === 'checkbox'">
                        <UCheckboxGroup 
                            v-model="state[fieldId]" :items="form.ui[fieldId]?.options"
                            :required="form.ui[fieldId]?.required" />
                    </template>
                    <template v-else-if="form.ui[fieldId]?.inputType === 'list'">
                        <USelectMenu 
                            v-model="state[fieldId]" :items="form.ui[fieldId]?.options"
                            :required="form.ui[fieldId]?.required" class="w-48" />
                    </template>
                </UFormField>

                <UButton type="submit" class="flex justify-self-center" icon="i-lucide-save">
                    Submit
                </UButton>
            </UForm>
        </template>
    </section>
</template>

<style>
.questionnaire * label {
    font-size: 1.15rem;
}
</style>
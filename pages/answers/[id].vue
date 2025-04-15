<script setup lang="ts">
import type { Answer, Questionnaire } from "~/utils/types";
import { AnswerService } from '~/services/answer';

const config = useRuntimeConfig();
const answerService = new AnswerService(config.public.apiBase as string);
const route = useRoute();
const toast = useToast();

const answerId = +route.params.id;
const answer = ref<Answer>(await answerService.getAnswerById(answerId));

const editAnswer = async (data: any) => {
    try {
        const newAnswer: Partial<Answer> = {
            form: JSON.stringify(data),
        }
        const response = await answerService.editAnswer(newAnswer, answer.value.id);
        answer.value = response;
        toast.add({ title: 'Success', description: 'The form has been edited.', color: 'success' });
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
        return;
    }
}

</script>

<template>
    <div v-if="answer" class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold mt-8 text-center">{{ answer.Questionnaire?.name }}</h1>
        <QuestionnaireForm :questionnaire="answer.Questionnaire!" :answer="answer" @onSubmit="editAnswer" />
    </div>
</template>

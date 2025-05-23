<script setup lang="ts">

import { QuestionnaireService } from '~/services/reflection';
import { AnswerService } from '~/services/reflectionAnswer';

const toast = useToast();

const config = useRuntimeConfig();
const questionnaireService = new QuestionnaireService(config.public.apiBase as string);
const answerService = new AnswerService(config.public.apiBase as string);

const route = useRoute()

const questionnaireId = +route.params.id;
const questionnaire = ref<Questionnaire>(await questionnaireService.getQuestionnaireById(questionnaireId));
const answers = reactive<Answer[]>(questionnaire.value.Answers || []);

const createInstance = async (data: any, binaryEvaluation: number) => {
    try {
        const newAnswer: Omit<Answer, "id"> = {
            questionnaireId: questionnaireId,
            form: JSON.stringify(data),
            binaryEvaluation: binaryEvaluation,
        }
        const response = await answerService.createAnswer(newAnswer, questionnaireId);
        answers.push(response);
        toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
        return;
    }
   
};


</script>

<template>
    <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold mt-8 text-center">{{ questionnaire.name }}</h1>
        <QuestionnaireForm :questionnaire="questionnaire" @on-submit="createInstance"/>
        
        <h2 class="text-xl font-bold mt-8 text-center">Answers</h2>
        <AnswerTable :answers="answers" />
    </div>
</template>

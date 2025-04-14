<script setup lang="ts">

import { AnswerService } from '~/services/answer';

const config = useRuntimeConfig();
const answerService = new AnswerService(config.public.apiBase as string);
const route = useRoute()

const answerId = +route.params.id;
const answer = ref<Answer>(await answerService.getAnswerById(answerId));

</script>

<template>
    <div v-if="answer" class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold mt-8 text-center">{{ answer.Questionnaire?.name }}</h1>
        <!-- <h1 class="text-2xl font-bold mt-8 text-center">{{ answer.Questionnaire.name }}</h1> -->
        <QuestionnaireForm :questionnaire="answer.Questionnaire!" :answer="answer" />
    </div>
</template>

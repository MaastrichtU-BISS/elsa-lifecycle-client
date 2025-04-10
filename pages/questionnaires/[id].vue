<script setup lang="ts">

import { QuestionnaireService } from '~/services/questionnaire';

const config = useRuntimeConfig();
const service = new QuestionnaireService(config.public.apiBase as string);

const route = useRoute()
const questionnaireId = +route.params.id;
const questionnaire = ref<Questionnaire>(await service.getQuestionnaireById(questionnaireId));


</script>

<template>
    <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">{{ questionnaire.name }}</h1>
        
        <QuestionnaireForm :questionnaire="questionnaire" />
    </div>
</template>

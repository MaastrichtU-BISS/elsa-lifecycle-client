<script setup lang="ts">
import type { Answer, Questionnaire } from "~/utils/types";
import { AnswerService } from '~/services/answer';
import { RecommendationService } from '~/services/recommendation';

const config = useRuntimeConfig();
const answerService = new AnswerService(config.public.apiBase as string);
const recommendationService = new RecommendationService(config.public.apiBase as string);
const route = useRoute();
const toast = useToast();

const answerId = +route.params.id;
const answer = ref<Answer>(await answerService.getAnswerById(answerId));
const recommendations = ref<Recommendation[]>(await recommendationService.getRecommendations(answer.value.questionnaireId, answer.value.binaryEvaluation));

const recommendedTools = computed(() => {
    const recommendedTools: Tool[] = []
    recommendations.value.forEach(r => recommendedTools.push(r.Tool!));
    return recommendedTools;
});

const editAnswer = async (data: any, binaryEvaluation: number) => {
    try {
        const newAnswer: Partial<Answer> = {
            form: JSON.stringify(data),
            binaryEvaluation: binaryEvaluation,
        }
        const response = await answerService.editAnswer(newAnswer, answer.value.id);
        answer.value = response;
        recommendations.value = await recommendationService.getRecommendations(answer.value.questionnaireId, answer.value.binaryEvaluation)
        toast.add({ title: 'Success', description: 'The form has been edited.', color: 'success' });
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
        return;
    }
}

</script>

<template>
    <section id="form" v-if="answer" class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold mt-8 text-center">{{ answer.Questionnaire?.name }}</h1>
        <QuestionnaireForm :questionnaire="answer.Questionnaire!" :answer="answer" @onSubmit="editAnswer" />
    </section>

    <section id="recommendations" v-if="recommendations" class="flex flex-col gap-4">
        <h2 class="text-xl font-bold mt-8 text-center">Recommended Tools</h2>
        <ToolList :tools="recommendedTools" />
    </section>
</template>

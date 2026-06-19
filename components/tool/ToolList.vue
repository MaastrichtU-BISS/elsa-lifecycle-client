<script lang="ts" setup>
import type { Tool, Recommendation, RecommendationAnswer } from '~/utils/types';
import type { RecommendationAnswerService } from '~/services/recommendationAnswer';

defineProps({
    tools: { type: Array as () => Tool[], required: true },
    journalId: { type: Number, required: false, default: null },
    recommendations: { type: Array as () => Recommendation[], required: false, default: () => [] },
    recommendationAnswerService: { type: Object as () => RecommendationAnswerService, required: false, default: null },
});

const answers = defineModel<RecommendationAnswer[]>('answers', { default: () => [] });
</script>

<template>
    <section id="list" class="flex flex-col gap-4">
        <TransitionGroup name="fade" tag="div" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ToolCard v-for="(tool, index) in tools" :key="tool.id" :tool="tools[index]"
                :recommendation="recommendations[index]" :journal-id="journalId"
                :recommendation-answer-service="recommendationAnswerService" v-model:answer="answers[index]" />
        </TransitionGroup>
    </section>
</template>
<style>
.fade-enter-active,
.fade-leave-active,
.fade-move {
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
}
</style>
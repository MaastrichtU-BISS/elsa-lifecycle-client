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
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <template v-for="(tool, index) in tools" :key="tool.id">
                <ToolCard 
                    :tool="tools[index]" 
                    :recommendation="recommendations[index]" 
                    :journal-id="journalId" 
                    :recommendation-answer-service="recommendationAnswerService"
                    v-model:answer="answers[index]" />
            </template>
        </div>
    </section>
</template>
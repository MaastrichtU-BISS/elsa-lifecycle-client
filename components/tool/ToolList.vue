<script lang="ts" setup>
import type { Tool, Recommendation, RecommendationAnswer } from '~/utils/types';

const { tools, recommendations, answers } = defineProps<{
    tools: Tool[]
    recommendations?: Recommendation[] // Optional, if you want to pass recommendations as well
    answers?: (RecommendationAnswer | undefined)[] // Optional
}>();

const emits = defineEmits(["updateAnswer"])

const updateAnswer = (newAnswer: RecommendationAnswer, index: number) => {
    emits("updateAnswer", newAnswer, index);
};

</script>

<template>

    <section id="list" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            <template v-for="(tool, index) in tools" :key="tool.id">
                <ToolCard :tool="tool" :recommendation="recommendations?.[index]" :answer="answers?.[index]"
                    :index="index" @update-answer="updateAnswer" />
            </template>
        </div>
    </section>

</template>
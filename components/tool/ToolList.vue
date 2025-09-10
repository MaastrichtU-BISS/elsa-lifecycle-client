<script lang="ts" setup>
import type { Tool, Recommendation, RecommendationAnswer } from '~/utils/types';

const tools = defineModel<Tool[]>('tools', { required: true });
const recommendations = defineModel<Recommendation[]>('recommendations', { default: () => [] });
const answers = defineModel<RecommendationAnswer[]>('answers', { default: () => [] });
</script>

<template>
    <section id="list" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            <template v-for="(tool, index) in tools" :key="tool.id">
                <ToolCard v-model:tool="tools[index]" v-model:recommendation="recommendations[index]"
                    v-model:answer="answers[index]" />
            </template>
        </div>
    </section>
</template>
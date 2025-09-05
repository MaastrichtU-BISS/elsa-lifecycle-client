<script lang="ts" setup>
import type { Tool, Recommendation, RecommendationAnswer } from '~/utils/types';

const tools = defineModel<Tool[]>('tools', { required: true });
const recommendations = defineModel<Recommendation[]>('recommendations');
const answers = defineModel<RecommendationAnswer[]>('answers');
</script>

<template>
    <section id="list" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            <template v-for="(tool, index) in tools" :key="tool.id">
                <ToolCard :tool="tool" :recommendation="recommendations?.[index]" :answer="answers?.[index]" />
            </template>
        </div>
    </section>
</template>
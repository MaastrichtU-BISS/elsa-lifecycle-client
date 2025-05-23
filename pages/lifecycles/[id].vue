<script setup lang="ts">
import type { Lifecycle, Phase, ReflectionAnswer } from "~/utils/types";
import { LifecycleService } from "~/services/lifecycle";
import { ReflectionAnswerService } from "~/services/reflectionAnswer";
import { RecommendationService } from "~/services/recommendation";
import { marked } from 'marked'

const toast = useToast();
const route = useRoute();
const config = useRuntimeConfig();
const lifecycleId = +route.params.id;

const lifecycleService = new LifecycleService(config.public.apiBase);
const reflectionAnswerService = new ReflectionAnswerService(config.public.apiBase);
const recommendationService = new RecommendationService(config.public.apiBase);

const lifeCycle = ref<Lifecycle>(await lifecycleService.getLifecycleById(lifecycleId));
const reflectionAnswers = ref<ReflectionAnswer[]>([]);
const journalAnswers = ref<JournalAnswer[]>([]);
const recommendedTools = ref<Tool[][]>([]);

if (!lifeCycle.value.Phases?.length) throw new Error("Lifecycle has no phases");

// Add indices introduction
const indices = ref([{
    label: 'Introduction',
    value: 'introduction',
    defaultExpanded: true,
    children: [
        {
            label: 'General',
            value: 'introduction-general',
            icon: 'i-lucide-info',
            defaultExpanded: true,
        },
        {
            label: 'Journal',
            value: 'introduction-journal',
            icon: 'i-lucide-book-open-text',
            defaultExpanded: true,
        }
    ]
}]);

// Set default index to Lifecycle General
const activeIndex = ref(indices.value[0].children[0]);

for (const phase of lifeCycle.value.Phases) {

    // Add indices phases
    indices.value.push({
        label: `Phase  ${phase.number} - ${phase.title}`,
        value: `phase${phase.number}`,
        defaultExpanded: true,
        children: [
            {
                label: 'Reflection',
                value: `phase${phase.number}-reflection`,
                icon: 'i-lucide-clipboard-pen-line',
                defaultExpanded: true,
            },
            {
                label: 'Recommendations',
                value: `phase${phase.number}-recommendations`,
                icon: 'i-lucide-wrench',
                defaultExpanded: true,
            },
            {
                label: 'Journal',
                value: 'phase1-journal',
                icon: 'i-lucide-book-open-text',
                defaultExpanded: true,
            }
        ]
    },);

    // Add reflection answers
    if (phase.Reflection?.Answers?.length) {
        // TODO: Don't take the first answer, but the one belonging to the current user
        reflectionAnswers.value.push(phase.Reflection.Answers[0]);
    }

    // Add journal answers
    if (phase.Journal?.Answers?.length) {
        // TODO: Don't take the first answer, but the one belonging to the current user
        journalAnswers.value.push(phase.Journal.Answers[0]);
    }

    // Add recommended tools
    if (phase.Reflection?.Answers?.length) {
        // TODO: Don't take the first answer, but the one belonging to the current user
        const recommendations = await recommendationService.getRecommendations(phase.Reflection.id, phase.Reflection.Answers[0].binaryEvaluation);
        console.log(phase.Reflection.id, phase.Reflection.Answers[0].binaryEvaluation)
        console.log(recommendations)
        recommendedTools.value.push(recommendations.map(r => r.Tool!));
    }
}


// Handle Reflections 
const createReflectionAnswer = async (data: any, binaryEvaluation: number, reflectionId: number) => {
    try {
        const newAnswer: Omit<ReflectionAnswer, "id"> = {
            reflectionId: reflectionId,
            form: JSON.stringify(data),
            binaryEvaluation: binaryEvaluation,
        }
        const response = await reflectionAnswerService.createReflectionAnswer(newAnswer);
        toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
        return response;
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
};

const editReflectionAnswer = async (data: any, binaryEvaluation: number, reflectionId: number) => {
    try {
        const newAnswer: Partial<ReflectionAnswer> = {
            form: JSON.stringify(data),
            binaryEvaluation: binaryEvaluation,
        }
        const response = await reflectionAnswerService.editReflectionAnswer(newAnswer, reflectionId);
        toast.add({ title: 'Success', description: 'The form has been edited.', color: 'success' });
        return response;
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
}

const createOrEditReflectionAnswer = async (data: any, binaryEvaluation: number, index: number) => {
    if (!lifeCycle.value.Phases?.length) throw new Error("Lifecycle has no phases");

    const phase = lifeCycle.value.Phases[index];
    const reflectionId = phase.Reflection?.id;

    if (!reflectionId) throw new Error(`Phase ${phase.number} has no reflection`);

    let answer: ReflectionAnswer | undefined;

    if (reflectionAnswers.value[index]?.form) {
        answer = await editReflectionAnswer(data, binaryEvaluation, reflectionId);
    } else {
        answer = await createReflectionAnswer(data, binaryEvaluation, reflectionId);
    }

    if (answer) {
        // update answer
        reflectionAnswers.value[index] = answer;

        // update recommended tools
        const recommendations = await recommendationService.getRecommendations(reflectionId, answer.binaryEvaluation);
        recommendedTools.value[index] = recommendations.map(r => r.Tool!);
    }
};

</script>

<template>
    <div>
        <section id="content" class="mt-2 mb-8">

            <USlideover :overlay="false" side="left" title="Indices" :ui="{ overlay: 'max-w-sm' }">
                <UButton label="Indices" trailing-icon="i-lucide-square-menu" class="ml-4 fixed left-[1em]" />

                <template #body>
                    <UTree v-model="activeIndex" :items="indices" />
                </template>
            </USlideover>

            <!-- LIFECYCLE GENERAL -->
            <div v-show="activeIndex.value == 'introduction-general'">
                <div class="prose dark:prose-invert lg:prose-xl" v-html="marked.parse(lifeCycle.general)" />
                <div class="flex justify-end my-4">
                    <UButton trailing-icon="i-lucide-arrow-right" size="md"
                        @click="activeIndex = indices[0].children[1]">
                        Journal
                    </UButton>
                </div>
            </div>

            <!-- LIFECYCLE INTRODUCTION -->
            <div v-show="activeIndex.value == 'introduction-journal'">
                <div class="prose dark:prose-invert lg:prose-xl" v-html="marked.parse(lifeCycle.introduction)" />
                <div class="flex justify-between my-8">
                    <UButton icon="i-lucide-arrow-left" size="md" @click="activeIndex = indices[0].children[0]">
                        General
                    </UButton>
                    <UButton trailing-icon="i-lucide-arrow-right" size="md"
                        @click="activeIndex = indices[1].children[0]">
                        Reflection
                    </UButton>
                </div>
            </div>

            <!-- PHASES -->
            <template v-if="lifeCycle?.Phases?.length">
                <div v-for="(phase, index) in lifeCycle.Phases" :key="phase.id">

                    <!-- PHASE REFLECTION  -->
                    <div v-show="activeIndex.value == `phase${phase.number}-reflection`">
                        <!-- Getting the first answer of this reflection. TODO: get the answer from the reflection and the user -->
                        <QuestionnaireForm :questionnaire="phase.Reflection?.form!"
                            :answer="reflectionAnswers[index]?.form"
                            @on-submit="(data: any, binaryEvaluation: number) => createOrEditReflectionAnswer(data, binaryEvaluation, index)" />
                        <div class="flex justify-between my-8">
                            <UButton icon="i-lucide-arrow-left" size="md"
                                @click="activeIndex = indices[phase.number - 1].children[1]">
                                Journal
                            </UButton>
                            <UButton trailing-icon="i-lucide-arrow-right" size="md"
                                @click="activeIndex = indices[phase.number].children[1]">
                                Recommendations
                            </UButton>
                        </div>
                    </div>

                    <!-- PHASE RECOMMENDATIONS -->
                    <div v-show="activeIndex.value == `phase${phase.number}-recommendations`">
                        <ToolList :tools="recommendedTools[index]" :title="'Recommended Tools'" />
                        <div class="flex justify-between my-8">
                            <UButton icon="i-lucide-arrow-left" size="md"
                                @click="activeIndex = indices[phase.number].children[0]">
                                Reflection</UButton>
                            <UButton trailing-icon="i-lucide-arrow-right" size="md"
                                @click="activeIndex = indices[phase.number].children[2]">Journal
                            </UButton>
                        </div>
                    </div>
                </div>
            </template>
        </section>
    </div>
</template>
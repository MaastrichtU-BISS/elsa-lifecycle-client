<script setup lang="ts">
import type { Lifecycle } from "~/utils/types";
import { LifecycleService } from "~/services/lifecycle";
import { marked } from 'marked'

const route = useRoute();
const config = useRuntimeConfig();
const lifecycleId = +route.params.id;

const lifecycleService = new LifecycleService(config.public.apiBase);

const lifeCycle = ref<Lifecycle>(await lifecycleService.getLifecycleById(lifecycleId));

const indices = ref([
    {
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
    },
    {
        label: 'Phase 1 - Project Definition / Project Scoping',
        value: 'phase1',
        defaultExpanded: true,
        children: [
            {
                label: 'Reflection',
                value: 'phase1-reflection',
                icon: 'i-lucide-clipboard-pen-line',
                defaultExpanded: true,
            },
            {
                label: 'Recommendations',
                value: 'phase1-recommendations',
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
    },
]);

const activeIndex = ref(indices.value[0].children[0]);

// const recommendedTools = computed(() => {
//   const recommendedTools: Tool[] = []
//   recommendations.value.forEach(r => recommendedTools.push(r.Tool!));
//   return recommendedTools;
// });

// const createAnswer = async (data: any, binaryEvaluation: number) => {
//   try {
//     const newAnswer: Omit<ReflectAnswer, "id"> = {
//       questionnaireId: questionnaireId,
//       form: JSON.stringify(data),
//       binaryEvaluation: binaryEvaluation,
//     }
//     const response = await answerService.createAnswer(newAnswer, questionnaireId);
//     answer.value = response;
//     toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
//   } catch (error) {
//     toast.add({ title: 'Error', description: error as string, color: 'error' });
//     return;
//   }
// };

// const editAnswer = async (data: any, binaryEvaluation: number) => {
//   try {
//     const newAnswer: Partial<Answer> = {
//       form: JSON.stringify(data),
//       binaryEvaluation: binaryEvaluation,
//     }
//     const response = await answerService.editAnswer(newAnswer, answer.value.id);
//     answer.value = response;
//     recommendations.value = await recommendationService.getRecommendations(answer.value.questionnaireId, answer.value.binaryEvaluation)
//     toast.add({ title: 'Success', description: 'The form has been edited.', color: 'success' });
//   } catch (error) {
//     toast.add({ title: 'Error', description: error as string, color: 'error' });
//     return;
//   }
// }

// const createOrEditAnswer = async (data: any, binaryEvaluation: number) => {
//   if (answer.value) {
//     await editAnswer(data, binaryEvaluation);
//   } else {
//     await createAnswer(data, binaryEvaluation);
//   }
// };

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

            <div v-show="activeIndex.value == 'introduction-general'">
                <div class="prose dark:prose-invert lg:prose-xl" v-html="marked.parse(lifeCycle.general)"></div>
                <div class="flex justify-end my-4">
                    <UButton trailing-icon="i-lucide-arrow-right" size="md"
                        @click="activeIndex = indices[0].children[1]">
                        Journal
                    </UButton>
                </div>
            </div>

            <div v-show="activeIndex.value == 'introduction-journal'">
                <div class="prose dark:prose-invert lg:prose-xl" v-html="marked.parse(lifeCycle.introduction)"></div>
                <div class="flex justify-between my-8">
                    <UButton icon="i-lucide-arrow-left" size="md" @click="activeIndex = indices[0].children[0]">General
                    </UButton>
                    <UButton trailing-icon="i-lucide-arrow-right" size="md"
                        @click="activeIndex = indices[1].children[0]">
                        Reflection
                    </UButton>
                </div>
            </div>
            <div v-show="activeIndex.value == 'phase1-reflection'">
                <!-- <QuestionnaireForm :questionnaire="" :answer="answer" @on-submit="createOrEditAnswer" /> -->
                <div class="flex justify-between my-8">
                    <UButton icon="i-lucide-arrow-left" size="md" @click="activeIndex = indices[0].children[1]">Journal
                    </UButton>
                    <UButton trailing-icon="i-lucide-arrow-right" size="md"
                        @click="activeIndex = indices[1].children[1]">
                        Recommendations
                    </UButton>
                </div>
            </div>
            <div v-show="activeIndex.value == 'phase1-recommendations'">
                <!-- <ToolList :tools="recommendedTools" :title="'Recommended Tools'" /> -->
                <div class="flex justify-between my-8">
                    <UButton icon="i-lucide-arrow-left" size="md" @click="activeIndex = indices[1].children[0]">
                        Reflection</UButton>
                    <UButton trailing-icon="i-lucide-arrow-right" size="md"
                        @click="activeIndex = indices[1].children[2]">Journal
                    </UButton>
                </div>
            </div>

        </section>
    </div>
</template>
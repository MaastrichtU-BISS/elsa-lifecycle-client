<script setup lang="ts">
import type { JournalAnswer, Lifecycle, Recommendation, ReflectionAnswer } from "~/utils/types";
import { LifecycleService } from "~/services/lifecycle";
import { ReflectionAnswerService } from "~/services/reflectionAnswer";
import { JournalAnswerService } from "~/services/journalAnswer";
import { RecommendationService } from "~/services/recommendation";
import { marked } from 'marked'

const toast = useToast();
const route = useRoute();
const router = useRouter()
const config = useRuntimeConfig();
const lifecycleId = +route.params.id;

const lifecycleService = new LifecycleService(config.public.apiBase);
const reflectionAnswerService = new ReflectionAnswerService(config.public.apiBase);
const journalAnswerService = new JournalAnswerService(config.public.apiBase);
const recommendationService = new RecommendationService(config.public.apiBase);

const lifeCycle = ref<Lifecycle>(await lifecycleService.getLifecycleById(lifecycleId));
const reflectionAnswers = ref<ReflectionAnswer[]>([]);
const journalAnswers = ref<JournalAnswer[]>([]);
const recommendations = ref<Recommendation[][]>([]);

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
            defaultExpanded: true
        },
        {
            label: 'Journal',
            value: 'introduction-journal',
            icon: 'i-lucide-book-open-text',
            defaultExpanded: true
        }
    ]
}]);

const hash = route.hash.substring(1);
let hashIndex = indices.value[0].children.find(x => x.value == hash);
const activeIndex = ref();

for (const phase of lifeCycle.value.Phases) {

    // Add indices phases
    indices.value.push({
        label: `Phase ${phase.number} - ${phase.title}`,
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
                value: `phase${phase.number}-journal`,
                icon: 'i-lucide-book-open-text',
                defaultExpanded: true,
            }
        ]
    },);

    if(!hashIndex) {
        const hit = indices.value.at(-1)?.children.find(x => x.value == hash)
        if(hit) {
            hashIndex = hit;
        }
    } 

    if (phase.Reflection?.Answers?.length) {
        // Add reflection answers
        // TODO: Don't take the first answer, but the one belonging to the current user
        reflectionAnswers.value.push(phase.Reflection.Answers[0]);

        // Add recommended tools
        // TODO: Don't take the first answer, but the one belonging to the current user
        const phaseRecommendations = await recommendationService.getRecommendations(phase.Reflection.id, phase.Reflection.Answers[0].binaryEvaluation);
        recommendations.value.push(phaseRecommendations);
    }

    // Add journal answers
    if (phase.Journal?.Answers?.length) {
        // TODO: Don't take the first answer, but the one belonging to the current user
        journalAnswers.value.push(phase.Journal.Answers[0]);
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
        const phaseRecommendations = await recommendationService.getRecommendations(reflectionId, answer.binaryEvaluation);
        recommendations.value[index] = phaseRecommendations;
    }
};

// Handle Recommendations
const recommendationProgress = computed(() => {
    const res: {completed: number; total: number; percent: number}[]  = [];
    if (!recommendations.value.length) return [];
    
    recommendations.value.forEach((phaseRecommendations) => {
        const total = phaseRecommendations.length;
        let completed = 0;
        phaseRecommendations.forEach((recommendation) => {
            const answer = recommendation.Answers?.at(0);
            if ((recommendation.Tool?.form !== undefined && answer?.form) && (recommendation.Tool?.url !== undefined && answer?.file)) {
                completed++;
            }
        });
        res.push({ completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0});
    }); 
    return res;
}); 

// Handle Journal
const createJournalAnswer = async (data: any, journalId: number) => {
    try {
        const newAnswer: Omit<JournalAnswer, "id"> = {
            journalId: journalId,
            form: JSON.stringify(data)
        }
        const response = await journalAnswerService.createJournalAnswer(newAnswer);
        toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
        return response;
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
};

const editJournalAnswer = async (data: any, journalId: number) => {
    try {
        const newAnswer: Partial<JournalAnswer> = {
            form: JSON.stringify(data),
        }
        const response = await journalAnswerService.editJournalAnswer(newAnswer, journalId);
        toast.add({ title: 'Success', description: 'The form has been edited.', color: 'success' });
        return response;
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
}

const createOrEditJournalAnswer = async (data: any, index: number) => {
    if (!lifeCycle.value.Phases?.length) throw new Error("Lifecycle has no phases");

    const phase = lifeCycle.value.Phases[index];
    const journalId = phase.Journal?.id;

    if (!journalId) throw new Error(`Phase ${phase.number} has no journal`);

    let answer: JournalAnswer | undefined;

    if (journalAnswers.value[index]?.form) {
        answer = await editJournalAnswer(data, journalId);
    } else {
        answer = await createJournalAnswer(data, journalId);
    }

    if (answer) {
        // update answer
        journalAnswers.value[index] = answer;
    }
}

// utils
watch(activeIndex, (val) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); //scroll to top
    router.push({ hash: `#${val.value}` }); //update url
});

onMounted(() => {
    // Set active index, Lifecycle General by default
    activeIndex.value = hashIndex ?? indices.value[0].children[0];
})


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

            <template v-if="activeIndex">
                <!-- LIFECYCLE GENERAL -->
                <div v-show="activeIndex.value == 'introduction-general' || activeIndex.value == 'introduction'">
                    <div class="prose dark:prose-invert lg:prose-xl" v-html="marked.parse(lifeCycle.general)" />
                    <div class="flex justify-end my-4">
                        <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                            @click="activeIndex = indices[0].children[1]">
                            Journal
                        </UButton>
                    </div>
                </div>

                <!-- LIFECYCLE INTRODUCTION -->
                <div v-show="activeIndex.value == 'introduction-journal'">
                    <div class="prose dark:prose-invert lg:prose-xl" v-html="marked.parse(lifeCycle.introduction)" />
                    <div class="flex justify-between my-8">
                        <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                            @click="activeIndex = indices[0].children[0]">
                            General
                        </UButton>
                        <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                            @click="activeIndex = indices[1].children[0]">
                            Reflection
                        </UButton>
                    </div>
                </div>

                <!-- PHASES -->
                <template v-if="lifeCycle?.Phases?.length">
                    <div v-for="(phase, index) in lifeCycle.Phases" :key="phase.id">

                        <!-- PHASE REFLECTION  -->
                        <div v-show="activeIndex.value == `phase${phase.number}-reflection` || activeIndex.value == `phase${phase.number}`">
                            <!-- Getting the first answer of this reflection. TODO: get the answer from the reflection and the user -->
                            <h1 class="text-2xl font-bold my-4 text-center">Reflection</h1>
                            <QuestionnaireForm :questionnaire="phase.Reflection?.form!"
                                :answer="reflectionAnswers[index]?.form"
                                @on-submit="(data: any, binaryEvaluation: number) => createOrEditReflectionAnswer(data, binaryEvaluation, index)" />
                            <div class="flex justify-between my-8">
                                <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                                    @click="activeIndex = indices[phase.number - 1].children[1]">
                                    Journal
                                </UButton>
                                <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                                    @click="activeIndex = indices[phase.number].children[1]">
                                    Recommendations
                                </UButton>
                            </div>
                        </div>

                        <!-- PHASE RECOMMENDATIONS -->
                        <div v-show="activeIndex.value == `phase${phase.number}-recommendations`">
                            <h1 class="text-2xl font-bold my-4 text-center">Recommended Tools</h1>
                            <RecommendationList :recommendations="recommendations[index]" />
                            <div class="my-4">
                                <UProgress v-model="recommendationProgress[index].percent" status />
                            </div>
                            <div class="flex justify-between my-8">
                                <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                                    @click="activeIndex = indices[phase.number].children[0]">
                                    Reflection</UButton>
                                <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                                    @click="activeIndex = indices[phase.number].children[2]">Journal
                                </UButton>
                            </div>
                        </div>

                        <!-- PHASE JOURNAL -->
                        <div v-show="activeIndex.value == `phase${phase.number}-journal`">
                            <h1 class="text-2xl font-bold my-4 text-center">Journal</h1>
                            <QuestionnaireForm :questionnaire="phase.Journal?.form!"
                                :answer="journalAnswers[index]?.form"
                                @on-submit="(data: any) => createOrEditJournalAnswer(data, index)" />
                            <div class="flex justify-between my-8">
                                <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                                    @click="activeIndex = indices[phase.number].children[1]">
                                    Recommendations</UButton>
                                <UButton v-if="index < indices.length - 2" trailing-icon="i-lucide-arrow-right"
                                    size="md" variant="outline"
                                    @click="activeIndex = indices[phase.number + 1].children[0]"> Next Phase
                                </UButton>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
        </section>
    </div>
</template>
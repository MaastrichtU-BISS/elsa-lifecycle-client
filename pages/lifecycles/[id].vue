<script setup lang="ts">
import type { JournalAnswer, Lifecycle, Recommendation, RecommendationAnswer, ReflectionAnswer } from "~/utils/types";
import { isRecommendationDone } from '~/utils/helpers';
import { LifecycleService } from "~/services/lifecycle";
import { ReflectionAnswerService } from "~/services/reflectionAnswer";
import { JournalAnswerService } from "~/services/journalAnswer";
import { RecommendationService } from "~/services/recommendation";
import { RecommendationAnswerService } from "~/services/recommendationAnswer";
import { marked } from 'marked'

const auth = useAuthStore();
const toast = useToast();
const route = useRoute();
const router = useRouter()
const config = useRuntimeConfig();
const lifecycleId = +route.params.id;

const lifecycleService = new LifecycleService(config.public.apiBase);
const reflectionAnswerService = new ReflectionAnswerService(config.public.apiBase);
const journalAnswerService = new JournalAnswerService(config.public.apiBase);
const recommendationService = new RecommendationService(config.public.apiBase);
const recommendationAnswerService = new RecommendationAnswerService(config.public.apiBase);

const lifeCycle = ref<Lifecycle>(await lifecycleService.getLifecycleById(lifecycleId));
const recommendations = ref<Recommendation[][]>([]);
const reflectionAnswers = ref<(ReflectionAnswer | undefined)[][]>([]);
const journalAnswers = ref<(JournalAnswer | undefined)[]>([]);
const recommendationAnswers = ref<RecommendationAnswer[][]>([]);
const activeIndex = ref();

// Add indices Get Started
const indices = ref([{
    label: 'Get Started',
    value: 'get-started',
    defaultExpanded: true,
    children: [
        {
            label: 'Welcome',
            value: 'get-started-welcome',
            icon: 'i-lucide-home',
            defaultExpanded: true
        },
        {
            label: 'Introduction',
            value: 'get-started-introduction',
            icon: 'i-lucide-info',
            defaultExpanded: true
        },
        {
            label: 'Journal',
            value: 'get-started-journal',
            icon: 'i-lucide-book-open-text',
            defaultExpanded: true
        }
    ]
}]);

// Handle Reflections 
const createReflectionAnswer = async (data: any, reflectionId: number) => {

    try {
        const newAnswer: Omit<ReflectionAnswer, "id" | "userId"> = {
            reflectionId: reflectionId,
            form: JSON.stringify(data),
        }
        const response = await reflectionAnswerService.createReflectionAnswer(newAnswer);
        toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
        return response;
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
};

const editReflectionAnswer = async (data: any, reflectionId: number) => {
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

const createOrEditReflectionAnswer = async (data: any, phaseIndex: number, reflectionIndex: number) => {

    if (!lifeCycle.value.Phases?.length) throw new Error("Lifecycle has no phases");

    if (!auth.token) {
        toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
        return
    }

    const phase = lifeCycle.value.Phases[phaseIndex];

    if (!phase.Reflections?.length) throw new Error(`Phase ${phase.title} has no reflections`);

    const reflectionId = phase.Reflections[reflectionIndex].id;

    let answer: ReflectionAnswer | undefined;

    if (reflectionAnswers.value[phaseIndex][reflectionIndex]?.id) {
        answer = await editReflectionAnswer(data, reflectionId);
    } else {
        answer = await createReflectionAnswer(data, reflectionId);
    }

    if (answer) {
        // // update answer
        // reflectionAnswers.value[phaseIndex][reflectionIndex] = answer;

        // // update recommended tools
        // const phaseRecommendations = await recommendationService.getRecommendations(reflectionId);
        // recommendations.value[phaseIndex][reflectionIndex] = phaseRecommendations;

        // // update recommendation answers
        // // TODO: optimize this to do it in a single query
        // const promises: Promise<RecommendationAnswer>[] = [];

        // phaseRecommendations.forEach((phaseRec: Recommendation) => {
        //     promises.push(recommendationAnswerService.GetRecommendationAnswerByUserIdAndRecommendationID(phaseRec.id));
        // });

        // recommendationAnswers.value[phaseIndex][reflectionIndex] = await Promise.all(promises);
    }
};

// Handle Recommendations
const recommendationProgress = computed(() => {
    const res: { completed: number; total: number; percent: number }[] = [];
    if (!recommendations.value.length) return [];

    recommendations.value.forEach((recs, index) => {
        const answers = recommendationAnswers.value[index];
        const total = recs.length;
        const completed = answers?.filter(answer => isRecommendationDone(answer?.Recommendation, answer))?.length ?? 0;
        res.push({ completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 });
    });

    return res;
});

// Handle Journals
const createJournalAnswer = async (data: any, journalId: number) => {
    try {
        const newAnswer: Omit<JournalAnswer, "id" | "userId"> = {
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

    if (!auth.token) {
        toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
        return
    }

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

// Handle RecommendationAnswers

const updateRecommendationAnswer = (newRecommendationAnswer: any, answerIndex: number, index: number) => {
    recommendationAnswers.value[index][answerIndex] = newRecommendationAnswer;
}

// utils
watch(activeIndex, (val) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); //scroll to top
    router.push({ hash: `#${val.value}` }); //update url
});

onMounted(async () => {

    if (!lifeCycle.value.Phases?.length) throw new Error("Lifecycle has no phases");

    if (auth.token) {
        // Set the user authentication token to the protected services (this has to be done on client side, because the token may be stored in the browser)
        reflectionAnswerService.setToken(auth.token);
        journalAnswerService.setToken(auth.token);
        recommendationAnswerService.setToken(auth.token);
    }

    const hash = route.hash.substring(1);
    let hashIndex = indices.value[0].children.find(x => x.value == hash);

    for (const phase of lifeCycle.value.Phases) {

        // Add indices phases
        indices.value.push({
            label: `${phase.title}`,
            value: `phase-${phase.title}`,
            defaultExpanded: true,
            children: [
                {
                    label: 'Introduction',
                    value: `phase${phase.title}-introduction`,
                    icon: 'i-lucide-home',
                    defaultExpanded: true,
                },
                ...(phase.Reflections?.map(r => ({
                    label: r.title,
                    value: `phase${r.title}-reflection`,
                    icon: 'i-lucide-circle-question-mark',
                    defaultExpanded: true,
                })) || []),
                {
                    label: 'Journal',
                    value: `phase${phase.title}-journal`,
                    icon: 'i-lucide-book-open-text',
                    defaultExpanded: true,
                }
            ]
        },);

        if (!hashIndex) {
            const hit = indices.value.at(-1)?.children.find(x => x.value == hash)
            if (hit) {
                hashIndex = hit;
            }
        }

        if (auth.token && phase.Reflections?.length) {
            reflectionAnswers.value.push([]);
            for (const reflection of phase.Reflections) {
                const refAnswer = await reflectionAnswerService.GetReflectionAnswerByUserIdAndReflectionID(reflection.id);
                // Add reflection answers
                if (refAnswer) {
                    reflectionAnswers.value.at(-1)?.push(refAnswer);

                    // // Add recommended tools
                    // const phaseRecommendations = await recommendationService.getRecommendations(reflection.id);
                    // recommendations.value.push(phaseRecommendations);

                    // // TODO: optimize this to do it in a single query
                    // const promises: Promise<RecommendationAnswer>[] = [];

                    // phaseRecommendations.forEach((phaseRec: Recommendation) => {
                    //     promises.push(recommendationAnswerService.GetRecommendationAnswerByUserIdAndRecommendationID(phaseRec.id));
                    // });

                    // recommendationAnswers.value.push(await Promise.all(promises));
                }
            }
        }

        // Add journal answers
        if (auth.token && phase.Journal) {
            const jouAnswer = await journalAnswerService.GetJournalAnswerByUserIdAndJournalID(phase.Journal.id);
            if (jouAnswer) {
                journalAnswers.value.push(jouAnswer);
            }
        }
    }

    // Set active index, Lifecycle General by default
    activeIndex.value = hashIndex ?? indices.value[0].children[0];

    console.log(lifeCycle.value);
    console.log(reflectionAnswers.value);
})

</script>

<template>
    <div>
        <section id="content" class="mt-2 mb-8">
            <USlideover :overlay="false" side="left" :title="lifeCycle.title" :description="lifeCycle.description"
                :ui="{ overlay: 'max-w-sm' }">
                <UButton label="Indices" trailing-icon="i-lucide-square-menu" class="ml-4 fixed left-[1em]" />

                <template #body>
                    <UTree v-model="activeIndex" :items="indices" />
                </template>
            </USlideover>

            <template v-if="activeIndex">
                <!-- GET STARTED -->

                <!-- WELCOME -->
                <div v-show="activeIndex.value == 'get-started-welcome' || activeIndex.value == 'get-started'">
                    <div class="lifecycle-content">
                        <div class="prose dark:prose-invert lg:prose-xl" v-html="marked.parse(lifeCycle.welcome)" />
                    </div>

                    <div class="flex justify-end my-8">
                        <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                            class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = indices[0].children[1]">
                            Introduction
                        </UButton>
                    </div>
                </div>

                <!-- INTRODUCTION -->
                <div v-show="activeIndex.value == 'get-started-introduction'">
                    <div class="lifecycle-content">
                        <div class="prose dark:prose-invert lg:prose-xl"
                            v-html="marked.parse(lifeCycle.introduction)" />
                    </div>

                    <div class="flex justify-between my-8">
                        <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                            class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = indices[0].children[0]">
                            Welcome
                        </UButton>
                        <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                            class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = indices[0].children[2]">
                            Journal
                        </UButton>
                    </div>
                </div>

                <!-- JOURNAL -->
                <div v-show="activeIndex.value == 'get-started-journal'">
                    <div class="lifecycle-content">
                        <div class="prose dark:prose-invert lg:prose-xl" v-html="marked.parse(lifeCycle.journal)" />
                    </div>

                    <div class="flex justify-between my-8">
                        <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                            class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = indices[0].children[1]">
                            Introduction
                        </UButton>
                        <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                            class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = indices[1].children[0]">
                            Reflection
                        </UButton>
                    </div>
                </div>

                <!-- PHASES -->
                <template v-for="(phase, phaseIndex) in lifeCycle.Phases" :key="phase.id">

                    <template v-if="activeIndex.value == `phase${phase.title}-introduction`">
                        <!-- PHASE INTRODUCTION  -->
                        <div class="lifecycle-content">
                            <h1 class="text-2xl font-bold mb-6">{{ `${phase.title}`
                            }}
                            </h1>

                            <div class="prose dark:prose-invert lg:prose-xl mb-6 text-justify"> {{
                                phase.description
                                }}</div>
                        </div>
                    </template>

                    <!-- REFLECTIONS -->
                    <template v-for="(reflection, reflectionIndex) in phase.Reflections" :key="reflection.title">
                        <!-- REFLECTION  -->
                        <div v-show="activeIndex.value == `phase${reflection.title}-reflection`">
                            <div class="lifecycle-content">
                                <h1 class="text-2xl font-bold mb-1">{{ `${reflection.title}`
                                    }}
                                </h1>


                                <div class="prose dark:prose-invert lg:prose-xl mb-6 text-justify"> {{
                                    reflection.description
                                    }}</div>

                                <p class="font-semibold mt-4">In your answer, you might consider:</p>

                                <ul class="list-disc list-inside mb-6">
                                    <li v-for="consideration in JSON.parse(reflection.considerations)"
                                        :key="consideration">
                                        {{ consideration }}
                                    </li>
                                </ul>

                                <QuestionnaireForm :questionnaire="reflection.form!"
                                        :answer="reflectionAnswers[phaseIndex][reflectionIndex]?.form"
                                        @on-submit="(data: any) => createOrEditReflectionAnswer(data, phaseIndex, reflectionIndex)" />
                            </div>

                        </div>

                        <!-- RECOMMENDATIONS -->
                        <div v-show="reflectionAnswers[phaseIndex][reflectionIndex]?.id">
                            <div class="lifecycle-content">
                                <h1 class="text-2xl font-bold mb-6">{{ `${phase.title}`
                                    }}
                                </h1>
                                <h2 class="text-xl font-bold mb-2">Recommended Tools</h2>
                                <!-- <ToolList :tools="recommendations[index]?.map(r => r.Tool!) || []"
                                        v-model:recommendations="recommendations[index]"
                                        v-model:answers="recommendationAnswers[index]" />
                                    <div v-if="recommendations[index]?.length" class="my-4">
                                        <UProgress v-model="recommendationProgress[index].percent" status />
                                    </div> -->
                            </div>

                            <div class="flex justify-between my-8">
                                <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                                    class="lifecycle-navigate-btn justify-between"
                                    @click="activeIndex = indices[phaseIndex].children[0]">
                                    Reflection</UButton>
                                <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                                    class="lifecycle-navigate-btn justify-between"
                                    @click="activeIndex = indices[phaseIndex].children[2]">Journal
                                </UButton>
                            </div>
                        </div>
                    </template>

                    <!-- PHASE JOURNAL -->
                    <div v-show="activeIndex.value == `phase${phaseIndex}-journal`">
                        <div class="lifecycle-content">
                            <h1 class="text-2xl font-bold mb-6">{{ `${phase.title}`
                            }}
                            </h1>
                            <h2 class="text-xl font-bold mb-1">Journal</h2>
                            <!-- <QuestionnaireForm :questionnaire="phase.Journal?.form!"
                                :answer="journalAnswers[index]?.form"
                                @on-submit="(data: any) => createOrEditJournalAnswer(data, index)" /> -->
                        </div>

                        <div class="flex justify-between my-8">
                            <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                                class="lifecycle-navigate-btn justify-between"
                                @click="activeIndex = indices[phaseIndex].children[1]">
                                Recommendations</UButton>
                            <UButton v-if="index < indices.length - 2" trailing-icon="i-lucide-arrow-right"
                                class="lifecycle-navigate-btn justify-between" size="md" variant="outline"
                                @click="activeIndex = indices[phaseIndex + 1].children[0]"> Next Phase
                            </UButton>
                        </div>

                        <div class="flex justify-between my-8">
                            <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                                class="lifecycle-navigate-btn justify-between"
                                @click="activeIndex = indices[phaseIndex].children.at(-1)">
                                Previous Journal
                            </UButton>
                            <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                                class="lifecycle-navigate-btn justify-between"
                                @click="activeIndex = indices[phaseIndex].children[1]">
                                Recommendations
                            </UButton>
                        </div>
                    </div>


                </template>
            </template>
        </section>
    </div>
</template>
<style lang="css">
.lifecycle-content {
    min-height: calc(100vh - 200px);
}

.lifecycle-navigate-btn {
    min-width: 170px !important;
}
</style>
<script setup lang="ts">
import type { JournalAnswer, Lifecycle, Recommendation, RecommendationAnswer, ReflectionAnswer } from "~/utils/types";
import { isRecommendationDone, isGetRecommendationsActive } from '~/utils/helpers';
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
const recommendations = ref<Recommendation[][][]>([]);
const reflectionAnswers = ref<(ReflectionAnswer | undefined)[][]>([]);
const journalAnswers = ref<(JournalAnswer | undefined)[]>([]);
const recommendationAnswers = ref<RecommendationAnswer[][][]>([]);
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
        // update answer
        reflectionAnswers.value[phaseIndex][reflectionIndex] = answer;

        // update recommended tools
        const phaseRecommendations = await recommendationService.getRecommendations(reflectionId, answer);
        recommendations.value[phaseIndex][reflectionIndex] = phaseRecommendations;

        // update recommendation answers
        // TODO: optimize this to do it in a single query
        const promises: Promise<RecommendationAnswer>[] = [];

        phaseRecommendations.forEach((phaseRec: Recommendation) => {
            promises.push(recommendationAnswerService.GetRecommendationAnswerByUserIdAndRecommendationID(phaseRec.id));
        });

        recommendationAnswers.value[phaseIndex][reflectionIndex] = await Promise.all(promises);
    }
};

// Handle Recommendations
const recommendationProgress = computed(() => {
    const res: { completed: number; total: number; percent: number }[][] = [];
    if (!recommendations.value.length) return [];

    recommendations.value.forEach((phase, i) => {
        res.push([]);
        phase.forEach((recs, j) => {
            const answers = recommendationAnswers.value[i][j];
            const total = recs.length;
            const completed = answers?.filter(answer => isRecommendationDone(answer?.Recommendation, answer))?.length ?? 0;
            res.at(-1)?.push({ completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 });
        })
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

const createOrEditJournalAnswer = async (data: any, phaseIndex: number) => {
    if (!lifeCycle.value.Phases?.length) throw new Error("Lifecycle has no phases");

    if (!auth.token) {
        toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
        return
    }

    const phase = lifeCycle.value.Phases[phaseIndex];
    const journalId = phase.Journal?.id;

    if (!journalId) throw new Error(`Phase ${phase.title} has no journal`);

    let answer: JournalAnswer | undefined;

    if (journalAnswers.value[phaseIndex]?.form) {
        answer = await editJournalAnswer(data, journalId);
    } else {
        answer = await createJournalAnswer(data, journalId);
    }

    if (answer) {
        // update answer
        journalAnswers.value[phaseIndex] = answer;
    }
}

// Handle RecommendationAnswers

// const updateRecommendationAnswer = (newRecommendationAnswer: any, answerIndex: number, index: number) => {
//     recommendationAnswers.value[index][answerIndex] = newRecommendationAnswer;
// }

function getBackIndex(index: number, childrenIndex: number) {
    return childrenIndex > 0 ? indices.value[index].children[childrenIndex - 1] : indices.value[index - 1].children.at(-1);
}

function getNextIndex(index: number, childrenIndex: number) {
    return childrenIndex < indices.value[index].children.length - 1 ? indices.value[index].children[childrenIndex + 1] : indices.value[index + 1]?.children[0];
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

        reflectionAnswers.value.push([]);
        recommendations.value.push([]);
        recommendationAnswers.value.push([]);

        if (auth.token && phase.Reflections?.length) {
            for (const reflection of phase.Reflections) {
                const refAnswer = await reflectionAnswerService.GetReflectionAnswerByUserIdAndReflectionID(reflection.id);
                // Add reflection answers
                if (refAnswer) {
                    reflectionAnswers.value.at(-1)?.push(refAnswer);

                    // Add recommended tools
                    const phaseRecommendations = await recommendationService.getRecommendations(reflection.id, refAnswer);
                    recommendations.value.at(-1)?.push(phaseRecommendations);

                    // TODO: optimize this to do it in a single query
                    const promises: Promise<RecommendationAnswer>[] = [];

                    phaseRecommendations.forEach((phaseRec: Recommendation) => {
                        promises.push(recommendationAnswerService.GetRecommendationAnswerByUserIdAndRecommendationID(phaseRec.id));
                    });

                    recommendationAnswers.value.at(-1)?.push(await Promise.all(promises));
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
})

</script>

<template>
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
                        class="lifecycle-navigate-btn justify-between" @click="activeIndex = getNextIndex(0, 0)">
                        {{ getNextIndex(0, 0)?.label }}
                    </UButton>
                </div>
            </div>

            <!-- INTRODUCTION -->
            <div v-show="activeIndex.value == 'get-started-introduction'">
                <div class="lifecycle-content">
                    <div class="prose dark:prose-invert lg:prose-xl" v-html="marked.parse(lifeCycle.introduction)" />
                </div>

                <div class="flex justify-between my-8">
                    <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                        class="lifecycle-navigate-btn justify-between" @click="activeIndex = getBackIndex(0, 1)">
                        {{ getBackIndex(0, 1)?.label }}</UButton>
                    <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                        class="lifecycle-navigate-btn justify-between" @click="activeIndex = getNextIndex(0, 1)">
                        {{ getNextIndex(0, 1)?.label }}
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
                        class="lifecycle-navigate-btn justify-between" @click="activeIndex = getBackIndex(0, 2)">
                        {{ getBackIndex(0, 2)?.label }}</UButton>
                    <UButton v-if="lifeCycle.Phases?.length" trailing-icon="i-lucide-arrow-right" size="md"
                        variant="outline" class="lifecycle-navigate-btn justify-between"
                        @click="activeIndex = getNextIndex(0, 2)">
                        {{ getNextIndex(0, 2)?.label }}
                    </UButton>
                </div>
            </div>

            <!-- PHASES -->
            <template v-for="(phase, phaseIndex) in lifeCycle.Phases" :key="phase.id">

                <div v-show="activeIndex.value == `phase${phase.title}-introduction`">
                    <!-- PHASE INTRODUCTION  -->
                    <div class="lifecycle-content">
                        <h1 class="text-2xl font-bold mb-6 text-center">{{ `${phase.title}`
                            }}
                        </h1>

                        <div class="prose dark:prose-invert lg:prose-xl mb-6 text-justify"> {{
                            phase.description
                            }}</div>
                    </div>

                    <div class="flex justify-between my-8">
                        <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                            class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = getBackIndex(phaseIndex + 1, 0)">
                            {{ getBackIndex(phaseIndex + 1, 0)?.label }}</UButton>
                        <UButton v-if="phase.Reflections?.length" trailing-icon="i-lucide-arrow-right"
                            class="lifecycle-navigate-btn justify-between" size="md" variant="outline"
                            @click="activeIndex = getNextIndex(phaseIndex + 1, 0)"> {{ getNextIndex(phaseIndex + 1,
                                0)?.label
                            }}
                        </UButton>
                    </div>
                </div>

                <!-- REFLECTIONS -->
                <template v-for="(reflection, reflectionIndex) in phase.Reflections" :key="reflection.title">
                    <!-- REFLECTION  -->
                    <div v-show="activeIndex.value == `phase${reflection.title}-reflection`">
                        <div class="lifecycle-content">
                            <h1 class="text-2xl font-bold mb-1 text-center">{{ `${reflection.title}`
                                }}
                            </h1>


                            <div class="prose dark:prose-invert lg:prose-xl mb-2 text-justify"> {{
                                reflection.description
                                }}</div>

                            <p class="font-semibold mb-4">In your answer, you might consider:</p>

                            <ul class="list-disc list-inside mb-6">
                                <li v-for="consideration in JSON.parse(reflection.considerations)" :key="consideration">
                                    {{ consideration }}
                                </li>
                            </ul>

                            <QuestionnaireForm :questionnaire="reflection.form!"
                                :answer="reflectionAnswers[phaseIndex][reflectionIndex]?.form"
                                @on-submit="(data: any) => createOrEditReflectionAnswer(data, phaseIndex, reflectionIndex)" />

                            <!-- RECOMMENDATIONS -->
                            <div v-show="isGetRecommendationsActive(reflectionAnswers[phaseIndex][reflectionIndex]?.form)"
                                class="mt-8">
                                <h2 class="text-xl font-bold mb-2">Recommended Tools</h2>
                                <ToolList :tools="recommendations[phaseIndex][reflectionIndex]?.map(r => r.Tool!) || []"
                                    v-model:recommendations="recommendations[phaseIndex][reflectionIndex]"
                                    v-model:answers="recommendationAnswers[phaseIndex][reflectionIndex]" />
                                <div v-if="recommendations[phaseIndex][reflectionIndex]?.length" class="my-4">
                                    <UProgress v-model="recommendationProgress[phaseIndex][reflectionIndex].percent"
                                        status />
                                </div>
                            </div>
                        </div>



                        <div class="flex justify-between my-8">
                            <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                                class="lifecycle-navigate-btn justify-between"
                                @click="activeIndex = getBackIndex(phaseIndex + 1, reflectionIndex + 1)">
                                {{ getBackIndex(phaseIndex + 1, reflectionIndex + 1)?.label
                                }}</UButton>
                            <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                                class="lifecycle-navigate-btn justify-between"
                                @click="activeIndex = getNextIndex(phaseIndex + 1, reflectionIndex + 1)">
                                {{ getNextIndex(phaseIndex + 1, reflectionIndex + 1)?.label
                                }}
                            </UButton>
                        </div>
                    </div>
                </template>

                <!-- PHASE JOURNAL -->
                <div v-show="activeIndex.value == `phase${phase.title}-journal`">
                    <div class="lifecycle-content">
                        <h1 class="text-2xl font-bold mb-6 text-center">Journal</h1>

                        <QuestionnaireForm :questionnaire="phase.Journal?.form!"
                            :answer="journalAnswers[phaseIndex]?.form"
                            @on-submit="(data: any) => createOrEditJournalAnswer(data, phaseIndex)" />
                    </div>

                    <div class="flex justify-between my-8">
                        <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                            class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = getBackIndex(phaseIndex + 1, phase.Reflections!.length + 1)">
                            {{ getBackIndex(phaseIndex + 1, phase.Reflections!.length + 1)?.label }}</UButton>
                        <UButton v-if="phaseIndex < indices.length - 2" trailing-icon="i-lucide-arrow-right"
                            class="lifecycle-navigate-btn justify-between" size="md" variant="outline"
                            @click="activeIndex = getNextIndex(phaseIndex + 1, phase.Reflections!.length + 1)"> {{
                                getNextIndex(phaseIndex + 1, phase.Reflections!.length + 1)?.label
                            }}
                        </UButton>
                    </div>
                </div>
            </template>
        </template>
    </section>
</template>
<style lang="css">
.lifecycle-content {
    min-height: calc(100vh - 200px);
}

.lifecycle-navigate-btn {
    min-width: 170px !important;
}
</style>
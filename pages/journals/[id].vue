<script setup lang="ts">
import type { FurtherReflectionAnswer, Recommendation, RecommendationAnswer, ReflectionAnswer, TreeNode } from "~/utils/types";
import { isRecommendationDone, isGetRecommendationsActive, isReflectionFinished, isPhaseFinished, openPdfInFullscreen } from '~/utils/helpers';
import { FurtherReflectionAnswerService } from "~/services/furtherReflectionAnswer";
import { JournalService } from "~/services/journal";
import { ReflectionAnswerService } from "~/services/reflectionAnswer";
import { RecommendationService } from "~/services/recommendation";
import { LifecycleService } from "~/services/lifecycle";
import { RecommendationAnswerService } from "~/services/recommendationAnswer";

const auth = useAuthStore();
const toast = useToast();
const route = useRoute();
const router = useRouter()
const config = useRuntimeConfig();
const journalId = +route.params.id;

const journalLoaded = ref(false);

const furtherReflectionAnswerService = new FurtherReflectionAnswerService(config.public.apiBase);
const journalService = new JournalService(config.public.apiBase);
const reflectionAnswerService = new ReflectionAnswerService(config.public.apiBase);
const recommendationService = new RecommendationService(config.public.apiBase);
const recommendationAnswerService = new RecommendationAnswerService(config.public.apiBase);
const lifecycleService = new LifecycleService(config.public.apiBase);

const journal = ref<Journal>();
const recommendations = ref<Recommendation[][][]>([]);
const furtherReflectionAnswers = ref<(FurtherReflectionAnswer | undefined)[][]>([]);
const reflectionAnswers = ref<(ReflectionAnswer | undefined)[][]>([]);
const recommendationAnswers = ref<RecommendationAnswer[][][]>([]);

const activeIndex = ref();
const expandedPhases = ref<string[]>([]);
const lastActiveIndex = ref<TreeNode | undefined>(undefined);
const hasUnsavedChanges = ref(false);
const unsavedChangesPhases = ref<Set<string>>(new Set());
const isPhasesOpen = ref(true);

const phases = ref<TreeNode[]>([]);

// Handle Reflections 
const createReflectionAnswer = async (data: any, reflectionId: number) => {

    try {
        const newAnswer: Omit<ReflectionAnswer, "id" | "userId"> = {
            reflectionId: reflectionId,
            journalId: journalId,
            form: JSON.stringify(data),
        }
        const response = await reflectionAnswerService.createReflectionAnswer(newAnswer);
        toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
        return response;
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
};

const editReflectionAnswer = async (data: any, reflectionAnswerId: number) => {
    try {
        const newAnswer: Partial<ReflectionAnswer> = {
            form: JSON.stringify(data),
        }
        const response = await reflectionAnswerService.editReflectionAnswer(newAnswer, reflectionAnswerId);
        toast.add({ title: 'Success', description: 'The form has been edited.', color: 'success' });
        return response;
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
}

const createOrEditReflectionAnswer = async (data: any, phaseIndex: number, reflectionIndex: number) => {

    if (!journal.value?.Lifecycle?.Phases?.length) throw new Error("Lifecycle has no phases");

    if (!auth.token) {
        toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
        return
    }

    const phase = journal.value.Lifecycle.Phases[phaseIndex];

    if (!phase.Reflections?.length) throw new Error(`Phase ${phase.title} has no reflections`);

    const reflectionId = phase.Reflections[reflectionIndex].id;

    let answer: ReflectionAnswer | undefined;

    if (reflectionAnswers.value[phaseIndex][reflectionIndex]?.id) {
        answer = await editReflectionAnswer(data, reflectionAnswers.value[phaseIndex][reflectionIndex].id!);
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
            promises.push(recommendationAnswerService.GetRecommendationAnswerByJournalIdAndRecommendationID(journalId, phaseRec.id));
        });

        recommendationAnswers.value[phaseIndex][reflectionIndex] = await Promise.all(promises);

        // Clear unsaved changes and update checkmarks
        hasUnsavedChanges.value = false;
        if (activeIndex.value?.value) {
            unsavedChangesPhases.value.delete(activeIndex.value.value);
        }
        updatePhasesWithCheckmarks();

    }
};

// Handle Further Reflections
const createFurtherReflectionAnswer = async (data: any, reflectionId: number) => {

    try {
        const newAnswer: Omit<FurtherReflectionAnswer, "id" | "userId"> = {
            reflectionId: reflectionId,
            journalId: journalId,
            form: JSON.stringify(data),
        }
        const response = await furtherReflectionAnswerService.createFurtherReflectionAnswer(newAnswer);
        toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
        return response;
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
};

const editFurtherReflectionAnswer = async (data: any, furtherReflectionAnswerId: number) => {
    try {
        const newAnswer: Partial<FurtherReflectionAnswer> = {
            form: JSON.stringify(data),
        }
        const response = await furtherReflectionAnswerService.editFurtherReflectionAnswer(newAnswer, furtherReflectionAnswerId);
        toast.add({ title: 'Success', description: 'The form has been edited.', color: 'success' });
        return response;
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
}

const createOrEditFurtherReflectionAnswer = async (data: any, phaseIndex: number, reflectionIndex: number) => {

    if (!journal.value?.Lifecycle?.Phases?.length) throw new Error("Lifecycle has no phases");

    if (!auth.token) {
        toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
        return
    }

    const phase = journal.value.Lifecycle.Phases[phaseIndex];

    if (!phase.Reflections?.length) throw new Error(`Phase ${phase.title} has no reflections`);

    const reflectionId = phase.Reflections[reflectionIndex].id;
    const existingAnswer = furtherReflectionAnswers.value[phaseIndex][reflectionIndex];

    let answer: FurtherReflectionAnswer | undefined;

    if (existingAnswer?.id) {
        answer = await editFurtherReflectionAnswer(data, existingAnswer.id);
    } else {
        answer = await createFurtherReflectionAnswer(data, reflectionId);
    }

    if (answer) {
        furtherReflectionAnswers.value[phaseIndex][reflectionIndex] = answer;

        // Clear unsaved changes and update checkmarks
        hasUnsavedChanges.value = false;
        if (activeIndex.value?.value) {
            unsavedChangesPhases.value.delete(activeIndex.value.value);
        }
        updatePhasesWithCheckmarks();
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

// Update phases with checkmarks for finished reflections
const updatePhasesWithCheckmarks = () => {
    if (!journal.value.Lifecycle?.Phases?.length) return;

    journal.value.Lifecycle.Phases.forEach((phase, phaseIndex) => {
        if (!phase.Reflections?.length) return;

        const phaseNode = phases.value[phaseIndex];
        if (!phaseNode?.children) return;

        // Update reflection checkmarks
        phase.Reflections.forEach((reflection, reflectionIndex) => {
            const child = phaseNode.children?.[reflectionIndex];
            if (child) {
                // If this reflection has unsaved changes, show warning icon
                if (unsavedChangesPhases.value.has(child.value)) {
                    child.trailingIcon = 'i-lucide-triangle-alert';
                } else {
                    const isFinished = isReflectionFinished(
                        reflectionAnswers.value[phaseIndex]?.[reflectionIndex],
                        furtherReflectionAnswers.value[phaseIndex]?.[reflectionIndex]
                    );
                    child.trailingIcon = isFinished ? 'i-lucide-check' : undefined;
                }
            }
        });

        // Update phase checkmark if all reflections are finished
        const allReflectionsFinished = isPhaseFinished(
            reflectionAnswers.value[phaseIndex] || [],
            furtherReflectionAnswers.value[phaseIndex] || []
        );
        phaseNode.trailingIcon = allReflectionsFinished ? 'i-lucide-check' : 'none';
    });
};

// Handle RecommendationAnswers

// const updateRecommendationAnswer = (newRecommendationAnswer: any, answerIndex: number, index: number) => {
//     recommendationAnswers.value[index][answerIndex] = newRecommendationAnswer;
// }

function getBackIndex(index: number, childrenIndex: number) {
    const currentGroup = phases.value[index];
    const previousGroup = phases.value[index - 1];

    const currentChildren = currentGroup?.children ?? [];
    const previousChildren = previousGroup?.children ?? [];

    if (childrenIndex === -1) {
        return previousChildren.at(-1) ?? previousGroup ?? currentGroup;
    }

    if (childrenIndex === 0) {
        return currentGroup;
    }

    return currentChildren[childrenIndex - 1] ?? currentGroup;
}

function getNextIndex(index: number, childrenIndex: number) {
    const currentGroup = phases.value[index];
    const nextGroup = phases.value[index + 1];
    const currentChildren = currentGroup?.children ?? [];

    if (childrenIndex === -1) {
        return currentChildren[0] ?? nextGroup ?? currentGroup;
    }

    return childrenIndex < currentChildren.length - 1
        ? currentChildren[childrenIndex + 1]
        : nextGroup ?? currentGroup;
}

async function openPdfPreviewForReflection(reflectionId: number) {
    if (!journal.value.Lifecycle) throw new Error("Journal has no lifecycle");

    await openPdfInFullscreen(journal.value.Lifecycle.id, lifecycleService, auth, toast, reflectionId);
}

watch(() => activeIndex.value?.value, (value) => {
    if (!value) return;
    window.scrollTo({ top: 0, behavior: 'smooth' }); //scroll to top
    router.push({ hash: `#${value}` }); //update url
});

watch(activeIndex, async (newValue, oldValue) => {
    if (newValue?.value) {
        // Show toast warning if there are unsaved changes
        if (hasUnsavedChanges.value && oldValue?.value !== newValue?.value) {
            toast.add({
                title: 'Unsaved changes',
                description: 'You have unsaved changes. Remember to save before leaving.',
                icon: 'i-lucide-triangle-alert',
                color: 'warning'
            });
            // Keep the unsavedChangesIndexValue set to show the warning icon
        }
        hasUnsavedChanges.value = false;
        lastActiveIndex.value = newValue;
        updatePhasesWithCheckmarks();
        return;
    }

    if (lastActiveIndex.value) {
        activeIndex.value = lastActiveIndex.value;
    }
});

// Watch for form changes and update phases
watch(hasUnsavedChanges, (changed) => {
    if (changed && activeIndex.value?.value) {
        unsavedChangesPhases.value.add(activeIndex.value.value);
        updatePhasesWithCheckmarks();
    }
});

watch(expandedPhases, (value) => {
    const fixed = phases.value.filter((index) => index.children?.length).map((index) => index.value);
    if (value.length !== fixed.length || fixed.some((v, i) => v !== value[i])) {
        expandedPhases.value = fixed;
    }
});

// Watch for changes in reflection and further reflection answers to update checkmarks
watch([reflectionAnswers, furtherReflectionAnswers], () => {
    updatePhasesWithCheckmarks();
}, { deep: true });

const initJournal = async (authToken: string) => {
    journalLoaded.value = true;

    journalService.setToken(authToken);
    furtherReflectionAnswerService.setToken(authToken);
    reflectionAnswerService.setToken(authToken);
    recommendationAnswerService.setToken(authToken);

    // Refetch journal to get the latest answers
    journal.value = await journalService.getJournalById(journalId);

    if (!journal.value.Lifecycle?.Phases?.length) throw new Error("Lifecycle has no phases");

    const hash = route.hash.substring(1);
    let hashIndex: TreeNode | undefined = undefined;

    for (const phase of journal.value.Lifecycle.Phases) {

        // Add phases phases
        const phaseChildren: TreeNode[] = [];

        // Add reflections
        if (phase.Reflections) {
            phase.Reflections.forEach((r) => {
                phaseChildren.push({
                    label: r.title,
                    value: `phase${r.title}-reflection`,
                    icon: 'i-lucide-circle-question-mark',
                    defaultExpanded: true,
                });
            });
        }

        phases.value.push({
            label: `${phase.title}`,
            value: `phase-${phase.title}`,
            defaultExpanded: true,
            children: phaseChildren,
            trailingIcon: 'none'
        });

        if (!hashIndex) {
            const hit = phases.value.at(-1)?.value === hash
                ? phases.value.at(-1)
                : phases.value.at(-1)?.children?.find(x => x.value == hash)
            if (hit) {
                hashIndex = hit;
            }
        }

        reflectionAnswers.value.push([]);
        furtherReflectionAnswers.value.push([]);
        recommendations.value.push([]);
        recommendationAnswers.value.push([]);

        if (auth.token && phase.Reflections?.length) {
            for (const reflection of phase.Reflections) {
                const refAnswer = await reflectionAnswerService.GetReflectionAnswerByJournalIdAndReflectionID(journal.value.id, reflection.id);
                // Add reflection answers
                if (refAnswer) {
                    reflectionAnswers.value.at(-1)?.push(refAnswer);

                    // Add recommended tools
                    const phaseRecommendations = await recommendationService.getRecommendations(reflection.id, refAnswer);
                    recommendations.value.at(-1)?.push(phaseRecommendations);

                    // TODO: optimize this to do it in a single query
                    const promises: Promise<RecommendationAnswer>[] = [];

                    phaseRecommendations.forEach((phaseRec: Recommendation) => {
                        promises.push(recommendationAnswerService.GetRecommendationAnswerByJournalIdAndRecommendationID(journal.value.id, phaseRec.id));
                    });

                    recommendationAnswers.value.at(-1)?.push(await Promise.all(promises));
                } else {
                    reflectionAnswers.value.at(-1)?.push(undefined);
                    recommendations.value.at(-1)?.push([]);
                    recommendationAnswers.value.at(-1)?.push([]);
                }

                const furtherRefAnswer = await furtherReflectionAnswerService.GetFurtherReflectionAnswerByJournalIdAndReflectionID(journal.value.id, reflection.id);
                furtherReflectionAnswers.value.at(-1)?.push(furtherRefAnswer || undefined);
            }
        }
    }

    //add export page
    phases.value.push({
        label: 'Export',
        value: 'export',
        icon: 'i-lucide-download',
        defaultExpanded: true,
        trailingIcon: 'none'
    });

    // hash was export
    if (!hashIndex) {
        const hit = phases.value.at(-1)?.value === hash ? phases.value.at(-1) : undefined;
        if (hit) {
            hashIndex = hit;
        }
    }

    expandedPhases.value = phases.value.filter((index) => index.children?.length).map((index) => index.value);

    // Set active index, Lifecycle General by default
    activeIndex.value = hashIndex ?? phases.value[0];
    lastActiveIndex.value = activeIndex.value;

    // Update phases with checkmarks for finished reflections
    updatePhasesWithCheckmarks();
}

watch(auth, async () => {
    if (!journalLoaded.value && auth.token) {
        initJournal(auth.token);
    }
});

onMounted(async () => {
    if (!journalLoaded.value && auth.token) {
        initJournal(auth.token);
    }
})

</script>

<template>
    <section v-if="journal" id="content" class="mt-2 mb-8">
        <USlideover data-testid="phases-drawer" v-model:open="isPhasesOpen" :modal="false"
            :title="journal?.title" :description="journal.Lifecycle?.description" :dismissible="false"
            :overlay="false" side="left" :ui="{
                overlay: 'max-w-sm',
                content: 'top-[48px] h-[calc(100dvh-48px)]'
            }">
            <UButton data-testid="phases-drawer-trigger" label="Phases" trailing-icon="i-lucide-square-menu"
                class="ml-4 fixed left-[1em]" />

            <template #body>
                <div class="rounded-md border border-default p-3 mb-6 text-xs leading-relaxed text-toned">
                    <p class="font-medium text-highlighted mb-1 flex items-center gap-1">
                        Start anywhere
                    </p>
                    <p>
                        Move freely between phases and questions. Return to revisit any entry whenever your thinking
                        evolves.
                    </p>
                </div>
                <UTree class="phases-tree" v-model="activeIndex" v-model:expanded="expandedPhases" :items="phases" />
            </template>
        </USlideover>

        <div data-testid="lifecycle-page" :class="['lifecycle-main', { 'phases-open': isPhasesOpen }]">
            <template v-if="activeIndex">
                <!-- PHASES -->
                <template v-for="(phase, phaseIndex) in journal.Lifecycle?.Phases" :key="phase.id">

                    <!-- PHASE INTRODUCTION  -->
                    <div v-show="activeIndex.value == `phase-${phase.title}`"
                        :data-testid="`phase-introduction-${phaseIndex}`">

                        <div class="lifecycle-content">
                            <h1 class="text-2xl font-bold mb-6 text-center">{{ `${phase.title}`
                            }}
                            </h1>

                            <div class="prose dark:prose-invert lg:prose-xl mb-6 text-justify"> {{
                                phase.description
                            }}</div>
                        </div>

                        <div class="flex justify-between my-8">
                            <div>
                                <UButton v-if="phaseIndex !== 0" icon="i-lucide-arrow-left" size="md" variant="outline"
                                    class="lifecycle-navigate-btn justify-between" :disabled="phaseIndex === 0"
                                    @click="activeIndex = getBackIndex(phaseIndex, -1)">
                                    {{ getBackIndex(phaseIndex, -1)?.label }}</UButton>
                            </div>
                            <UButton v-if="phase.Reflections?.length" trailing-icon="i-lucide-arrow-right"
                                :data-testid="`phase-next-reflection-${phaseIndex}`"
                                class="lifecycle-navigate-btn justify-between" size="md" variant="outline"
                                @click="activeIndex = getNextIndex(phaseIndex, -1)"> {{ getNextIndex(phaseIndex,
                                    -1)?.label
                                }}
                            </UButton>
                        </div>
                    </div>

                    <!-- REFLECTIONS -->
                    <template v-for="(reflection, reflectionIndex) in phase.Reflections" :key="reflection.title">
                        <!-- REFLECTION  -->
                        <div v-show="activeIndex.value == `phase${reflection.title}-reflection`"
                            :data-testid="`phase-reflection-${phaseIndex}-${reflectionIndex}`">
                            <div class="lifecycle-content">
                                <h1 class="text-2xl font-bold mb-1 text-center">{{ `${reflection.title}`
                                }}
                                </h1>


                                <div class="dark:prose-invert prose lg:prose-xl mb-2 text-justify"> {{
                                    reflection.description
                                }}</div>

                                <p class="font-semibold mb-4">In your answer, you might consider:</p>

                                <ul class="list-disc list-inside mb-6">
                                    <li v-for="consideration in JSON.parse(reflection.considerations)"
                                        :key="consideration">
                                        {{ consideration }}
                                    </li>
                                </ul>

                                <UAlert v-if="!auth.token" icon="i-lucide-info" color="warning" variant="subtle"
                                    title="Please log in to save your answers"
                                    description="You need to be logged in to fill and save reflection forms."
                                    class="mb-4" />
                                <div :data-testid="`reflection-form-${phaseIndex}-${reflectionIndex}`">
                                    <QuestionnaireForm :questionnaire="reflection.form!"
                                        :answer="reflectionAnswers[phaseIndex][reflectionIndex]?.form"
                                        :disabled="!auth.token"
                                        @on-submit="(data: any) => createOrEditReflectionAnswer(data, phaseIndex, reflectionIndex)"
                                        @form-changed="(changed: boolean) => hasUnsavedChanges = changed" />
                                </div>
                                <!-- RECOMMENDATIONS -->
                                <div v-show="isGetRecommendationsActive(reflectionAnswers[phaseIndex][reflectionIndex]?.form)"
                                    class="mt-10"
                                    :data-testid="`recommendations-section-${phaseIndex}-${reflectionIndex}`">
                                    <h2 class="text-xl font-bold mb-2">Recommended Tools</h2>
                                    <ToolList
                                        :tools="recommendations[phaseIndex][reflectionIndex]?.map(r => r.Tool!) || []"
                                        :recommendation-answer-service="recommendationAnswerService"
                                        :journal-id="journalId"
                                        :recommendations="recommendations[phaseIndex][reflectionIndex]"
                                        v-model:answers="recommendationAnswers[phaseIndex][reflectionIndex]" />
                                    <div v-if="recommendations[phaseIndex][reflectionIndex]?.length" class="my-4">
                                        <UProgress
                                            :data-testid="`recommendation-progress-${phaseIndex}-${reflectionIndex}`"
                                            v-model="recommendationProgress[phaseIndex][reflectionIndex].percent"
                                            status />
                                    </div>
                                    <div class="mt-10"
                                        :data-testid="`further-reflection-section-${phaseIndex}-${reflectionIndex}`">
                                        <h2 class="text-xl font-bold mb-2">Further Reflection</h2>
                                        <div :data-testid="`further-reflection-form-${phaseIndex}-${reflectionIndex}`">
                                            <QuestionnaireForm :questionnaire="reflection.furtherReflectionForm!"
                                                :answer="furtherReflectionAnswers[phaseIndex][reflectionIndex]?.form"
                                                :disabled="!auth.token"
                                                @on-submit="(data: any) => createOrEditFurtherReflectionAnswer(data, phaseIndex, reflectionIndex)"
                                                @form-changed="(changed: boolean) => hasUnsavedChanges = changed" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-between my-8">
                                <UButton icon="i-lucide-arrow-left" size="md" variant="outline"
                                    class="lifecycle-navigate-btn justify-between"
                                    @click="activeIndex = getBackIndex(phaseIndex, reflectionIndex)"
                                    :data-testid="`reflection-back-${phaseIndex}-${reflectionIndex}`">
                                    {{ getBackIndex(phaseIndex, reflectionIndex)?.label
                                    }}</UButton>

                                <UButton icon="i-lucide-eye" size="md" variant="outline"
                                    class="lifecycle-navigate-btn justify-center"
                                    @click="openPdfPreviewForReflection(reflection.id)"
                                    :data-testid="`reflection-preview-${phaseIndex}-${reflectionIndex}`">See preview
                                </UButton>
                                <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                                    class="lifecycle-navigate-btn justify-between"
                                    @click="activeIndex = getNextIndex(phaseIndex, reflectionIndex)"
                                    :data-testid="`reflection-next-${phaseIndex}-${reflectionIndex}`">
                                    {{ getNextIndex(phaseIndex, reflectionIndex)?.label
                                    }}
                                </UButton>
                            </div>
                        </div>
                    </template>

                </template>

                <!-- EXPORT AS PDF -->
                <div v-show="activeIndex.value == 'export'">
                    <div class="lifecycle-content mt-4">
                        <h1 class="text-2xl font-bold mb-6 text-center">Export</h1>

                        <LifecyclePdfExport :lifecycle-id="journal.lifecycleId" :lifecycle-title="journal.title"
                            :active="activeIndex?.value === 'export'" />
                    </div>

                    <div class="flex justify-between my-8">
                        <UButton v-if="journal.Lifecycle?.Phases?.length" icon="i-lucide-arrow-left" size="md"
                            variant="outline" class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = getBackIndex(journal.Lifecycle?.Phases?.length, -1)">
                            {{ getBackIndex(journal.Lifecycle?.Phases?.length, -1)?.label }}</UButton>
                    </div>
                </div>
            </template>
        </div>
    </section>
</template>
<style lang="css">
.lifecycle-main {
    max-width: 1220px;
    margin: 0 auto;
    transition: padding-left 220ms ease, max-width 220ms ease;
}

.lifecycle-main.phases-open {
    padding-left: 22rem;
    max-width: 1650px;
}

.lifecycle-main .prose {
    width: 100%;
    max-width: 95ch;
    margin-left: auto;
    margin-right: auto;
}

.lifecycle-content {
    min-height: calc(100vh - 200px);
}

.lifecycle-navigate-btn {
    min-width: 170px !important;
}

/* Global styles to ensure checkmark icon displays correctly */
.phases-tree .i-lucide\:check {
    color: rgb(34, 197, 94) !important;
    /* green-500 */
    rotate: 0deg !important;
}

/* Global styles to ensure warning icon displays correctly */
.phases-tree .i-lucide\:triangle-alert {
    color: rgb(234, 179, 8) !important;
    /* yellow-500 */
    rotate: 0deg !important;
}

/* Hide expansion chevrons in phases tree (folder rows) */
.phases-tree .i-lucide\:chevron-down,
.phases-tree .i-lucide\:chevron-up,
.phases-tree .i-lucide\:chevron-right,
.phases-tree .i-lucide\:chevron-left {
    display: none !important;
}

@media (max-width: 1024px) {
    .lifecycle-main.phases-open {
        padding-left: 0;
    }
}
</style>
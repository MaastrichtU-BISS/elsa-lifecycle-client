<script setup lang="ts">
import type { FurtherReflectionAnswer, Recommendation, RecommendationAnswer, Reflection, ReflectionAnswer, TreeNode } from "~/utils/types";
import { isRecommendationDone, isGetRecommendationsActive, isReflectionFinished, openPdfInFullscreen } from '~/utils/helpers';
import { FurtherReflectionAnswerService } from "~/services/furtherReflectionAnswer";
import { JournalService } from "~/services/journal";
import { ReflectionAnswerService } from "~/services/reflectionAnswer";
import { RecommendationService } from "~/services/recommendation";
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

const journal = ref<Journal>();

// All indexed by the reflection's position in journal.Lifecycle.Reflections
const recommendations = ref<Recommendation[][]>([]);
const furtherReflectionAnswers = ref<(FurtherReflectionAnswer | undefined)[]>([]);
const reflectionAnswers = ref<(ReflectionAnswer | undefined)[]>([]);
const recommendationAnswers = ref<RecommendationAnswer[][]>([]);

const activeIndex = ref<TreeNode>();
const lastActiveIndex = ref<TreeNode | undefined>(undefined);
const hasUnsavedChanges = ref(false);
const unsavedChangesItems = ref<Set<string>>(new Set());
const isPhasesOpen = ref(true);

// Journal index: one item per reflection, followed by the export page
const navItems = ref<TreeNode[]>([]);

const reflections = computed<Reflection[]>(() => journal.value?.Lifecycle?.Reflections ?? []);

const reflectionNavValue = (reflection: Reflection) => `reflection-${reflection.id}`;

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

const clearUnsavedChanges = () => {
    hasUnsavedChanges.value = false;
    if (activeIndex.value?.value) {
        unsavedChangesItems.value.delete(activeIndex.value.value);
    }
    updateNavCheckmarks();
};

const createOrEditReflectionAnswer = async (data: any, reflectionIndex: number) => {
    if (!auth.token) {
        toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
        return
    }

    const reflectionId = reflections.value[reflectionIndex].id;
    const existingAnswer = reflectionAnswers.value[reflectionIndex];

    let answer: ReflectionAnswer | undefined;

    if (existingAnswer?.id) {
        answer = await editReflectionAnswer(data, existingAnswer.id);
    } else {
        answer = await createReflectionAnswer(data, reflectionId);
    }

    if (answer) {
        // update answer
        reflectionAnswers.value[reflectionIndex] = answer;

        // update recommended tools
        const reflectionRecommendations = await recommendationService.getRecommendations(reflectionId, answer);
        recommendations.value[reflectionIndex] = reflectionRecommendations;

        // update recommendation answers
        // TODO: optimize this to do it in a single query
        recommendationAnswers.value[reflectionIndex] = await Promise.all(
            reflectionRecommendations.map((rec: Recommendation) =>
                recommendationAnswerService.GetRecommendationAnswerByJournalIdAndRecommendationID(journalId, rec.id))
        );

        clearUnsavedChanges();
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

const createOrEditFurtherReflectionAnswer = async (data: any, reflectionIndex: number) => {
    if (!auth.token) {
        toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
        return
    }

    const reflectionId = reflections.value[reflectionIndex].id;
    const existingAnswer = furtherReflectionAnswers.value[reflectionIndex];

    let answer: FurtherReflectionAnswer | undefined;

    if (existingAnswer?.id) {
        answer = await editFurtherReflectionAnswer(data, existingAnswer.id);
    } else {
        answer = await createFurtherReflectionAnswer(data, reflectionId);
    }

    if (answer) {
        furtherReflectionAnswers.value[reflectionIndex] = answer;
        clearUnsavedChanges();
    }
};

// Handle Recommendations
const recommendationProgress = computed(() => {
    return recommendations.value.map((recs, i) => {
        const answers = recommendationAnswers.value[i];
        const total = recs.length;
        const completed = answers?.filter(answer => isRecommendationDone(answer?.Recommendation, answer))?.length ?? 0;
        return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
    });
});

// Show a checkmark for finished reflections and a warning for unsaved changes
const updateNavCheckmarks = () => {
    reflections.value.forEach((reflection, reflectionIndex) => {
        const item = navItems.value[reflectionIndex];
        if (!item) return;

        if (unsavedChangesItems.value.has(item.value)) {
            item.trailingIcon = 'i-lucide-triangle-alert';
        } else {
            const isFinished = isReflectionFinished(
                reflectionAnswers.value[reflectionIndex],
                furtherReflectionAnswers.value[reflectionIndex]
            );
            item.trailingIcon = isFinished ? 'i-lucide-check' : undefined;
        }
    });
};

// Previous and next items in the journal index (the export page is the last item)
const getBackItem = (index: number) => navItems.value[index - 1];
const getNextItem = (index: number) => navItems.value[index + 1];

async function openPdfPreviewForReflection(reflectionId: number) {
    if (!journal.value) throw new Error("No journal loaded");

    await openPdfInFullscreen(journal.value.id, journalService, auth, toast, reflectionId);
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
            // Keep the item in unsavedChangesItems to show the warning icon
        }
        hasUnsavedChanges.value = false;
        lastActiveIndex.value = newValue;
        updateNavCheckmarks();
        return;
    }

    // clicking the selected item again deselects it: keep it selected
    if (lastActiveIndex.value) {
        activeIndex.value = lastActiveIndex.value;
    }
});

// Watch for form changes and mark the active item
watch(hasUnsavedChanges, (changed) => {
    if (changed && activeIndex.value?.value) {
        unsavedChangesItems.value.add(activeIndex.value.value);
        updateNavCheckmarks();
    }
});

// Watch for changes in reflection and further reflection answers to update checkmarks
watch([reflectionAnswers, furtherReflectionAnswers], () => {
    updateNavCheckmarks();
}, { deep: true });

const initJournal = async (authToken: string) => {
    journalLoaded.value = true;

    journalService.setToken(authToken);
    furtherReflectionAnswerService.setToken(authToken);
    reflectionAnswerService.setToken(authToken);
    recommendationAnswerService.setToken(authToken);

    // Refetch journal to get the latest answers
    journal.value = await journalService.getJournalById(journalId);

    if (!reflections.value.length) throw new Error("Lifecycle has no reflections");

    for (const reflection of reflections.value) {
        navItems.value.push({
            label: reflection.title,
            value: reflectionNavValue(reflection),
            icon: 'i-lucide-circle-question-mark',
        });

        const refAnswer = await reflectionAnswerService.GetReflectionAnswerByJournalIdAndReflectionID(journal.value.id, reflection.id);
        reflectionAnswers.value.push(refAnswer || undefined);

        if (refAnswer) {
            // Add recommended tools
            const reflectionRecommendations = await recommendationService.getRecommendations(reflection.id, refAnswer);
            recommendations.value.push(reflectionRecommendations);

            // TODO: optimize this to do it in a single query
            recommendationAnswers.value.push(await Promise.all(
                reflectionRecommendations.map((rec: Recommendation) =>
                    recommendationAnswerService.GetRecommendationAnswerByJournalIdAndRecommendationID(journal.value!.id, rec.id))
            ));
        } else {
            recommendations.value.push([]);
            recommendationAnswers.value.push([]);
        }

        const furtherRefAnswer = await furtherReflectionAnswerService.GetFurtherReflectionAnswerByJournalIdAndReflectionID(journal.value.id, reflection.id);
        furtherReflectionAnswers.value.push(furtherRefAnswer || undefined);
    }

    //add export page
    navItems.value.push({
        label: 'Export',
        value: 'export',
        icon: 'i-lucide-download',
        trailingIcon: 'none'
    });

    // Open the item from the URL hash, or the first reflection
    const hash = route.hash.substring(1);
    activeIndex.value = navItems.value.find(item => item.value === hash) ?? navItems.value[0];
    lastActiveIndex.value = activeIndex.value;

    // Update checkmarks for finished reflections
    updateNavCheckmarks();
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
            :title="journal?.title" :description="journal.Lifecycle?.title" :dismissible="false"
            :overlay="false" side="left" :ui="{
                overlay: 'max-w-sm',
                content: 'top-[65px] h-[calc(100dvh-65px)]'
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
                <UTree class="phases-tree" v-model="activeIndex" :items="navItems" />
            </template>
        </USlideover>

        <div data-testid="lifecycle-page" :class="['lifecycle-main', { 'phases-open': isPhasesOpen }]">
            <template v-if="activeIndex">
                <!-- REFLECTIONS -->
                <div v-for="(reflection, reflectionIndex) in reflections"
                    v-show="activeIndex.value == reflectionNavValue(reflection)" :key="reflection.id"
                    :data-testid="`reflection-${reflectionIndex}`">
                    <div class="lifecycle-content">
                        <h1 class="text-2xl font-bold mb-6">{{ reflection.title }}</h1>

                        <div v-if="reflection.context" class="prose dark:prose-invert lg:prose-xl mb-6 text-justify">
                            {{ reflection.context }}
                        </div>

                        <div class="dark:prose-invert prose lg:prose-xl mb-2 text-justify font-semibold">
                            {{ reflection.description }}
                        </div>

                        <p class="font-semibold mb-4">In your answer, you might consider:</p>

                        <ul class="list-disc list-inside mb-6">
                            <li v-for="consideration in JSON.parse(reflection.considerations)" :key="consideration">
                                {{ consideration }}
                            </li>
                        </ul>

                        <UAlert v-if="!auth.token" icon="i-lucide-info" color="warning" variant="subtle"
                            title="Please log in to save your answers"
                            description="You need to be logged in to fill and save reflection forms." class="mb-4" />
                        <div :data-testid="`reflection-form-${reflectionIndex}`">
                            <QuestionnaireForm :questionnaire="reflection.form!"
                                :answer="reflectionAnswers[reflectionIndex]?.form" :disabled="!auth.token"
                                @on-submit="(data: any) => createOrEditReflectionAnswer(data, reflectionIndex)"
                                @form-changed="(changed: boolean) => hasUnsavedChanges = changed" />
                        </div>
                        <!-- RECOMMENDATIONS -->
                        <div v-show="isGetRecommendationsActive(reflectionAnswers[reflectionIndex]?.form)" class="mt-10"
                            :data-testid="`recommendations-section-${reflectionIndex}`">
                            <h2 class="text-xl font-bold mb-2">Recommended Tools</h2>
                            <ToolList :tools="recommendations[reflectionIndex]?.map(r => r.Tool!) || []"
                                :recommendation-answer-service="recommendationAnswerService" :journal-id="journalId"
                                :recommendations="recommendations[reflectionIndex]"
                                v-model:answers="recommendationAnswers[reflectionIndex]" />
                            <div v-if="recommendations[reflectionIndex]?.length" class="my-4">
                                <UProgress :data-testid="`recommendation-progress-${reflectionIndex}`"
                                    v-model="recommendationProgress[reflectionIndex].percent" status />
                            </div>
                            <div class="mt-10" :data-testid="`further-reflection-section-${reflectionIndex}`">
                                <h2 class="text-xl font-bold mb-2">Further Reflection</h2>
                                <div :data-testid="`further-reflection-form-${reflectionIndex}`">
                                    <QuestionnaireForm :questionnaire="reflection.furtherReflectionForm!"
                                        :answer="furtherReflectionAnswers[reflectionIndex]?.form"
                                        :disabled="!auth.token"
                                        @on-submit="(data: any) => createOrEditFurtherReflectionAnswer(data, reflectionIndex)"
                                        @form-changed="(changed: boolean) => hasUnsavedChanges = changed" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between my-8">
                        <div>
                            <UButton v-if="getBackItem(reflectionIndex)" icon="i-lucide-arrow-left" size="md"
                                variant="outline" class="lifecycle-navigate-btn justify-between"
                                @click="activeIndex = getBackItem(reflectionIndex)"
                                :data-testid="`reflection-back-${reflectionIndex}`">
                                {{ getBackItem(reflectionIndex)?.label }}</UButton>
                        </div>

                        <UButton icon="i-lucide-eye" size="md" variant="outline"
                            class="lifecycle-navigate-btn justify-center"
                            @click="openPdfPreviewForReflection(reflection.id)"
                            :data-testid="`reflection-preview-${reflectionIndex}`">See preview
                        </UButton>
                        <UButton trailing-icon="i-lucide-arrow-right" size="md" variant="outline"
                            class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = getNextItem(reflectionIndex)"
                            :data-testid="`reflection-next-${reflectionIndex}`">
                            {{ getNextItem(reflectionIndex)?.label }}
                        </UButton>
                    </div>
                </div>

                <!-- EXPORT AS PDF -->
                <div v-show="activeIndex.value == 'export'">
                    <div class="lifecycle-content">
                        <h1 class="text-2xl font-bold mb-6 text-center">Export</h1>

                        <JournalPdfExport :journal-id="journal.id" :journal-title="journal.title"
                            :active="activeIndex?.value === 'export'" />
                    </div>

                    <div class="flex justify-between my-8">
                        <UButton v-if="getBackItem(reflections.length)" icon="i-lucide-arrow-left" size="md"
                            variant="outline" class="lifecycle-navigate-btn justify-between"
                            @click="activeIndex = getBackItem(reflections.length)">
                            {{ getBackItem(reflections.length)?.label }}</UButton>
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

/* Hide expansion chevrons in phases tree */
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
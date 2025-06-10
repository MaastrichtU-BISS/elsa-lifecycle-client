<script lang="ts" setup>
import { RecommendationAnswerService } from '~/services/recommendationAnswer';

const props = defineProps<{
    tool: Tool;
    recommendation?: Recommendation | null; // Optional, if you want to pass a recommendation   
}>();

const modalOpened = ref(false);
const config = useRuntimeConfig();
const $toast = useToast();
const recommendationAnswerService = new RecommendationAnswerService(config.public.apiBase as string);

const recommendationAnswer = computed(() => {
    return props.recommendation?.Answers?.at(0);
});

const tags = computed(() => {
    return props.tool.tags.split(",");
});

const recommendationIsDone = computed(() => {
    if (!props.recommendation) return false;
    const answer = props.recommendation.Answers?.at(0);

    if (!answer) return false;

    // TODO: get answer from current user
    return (props.recommendation.Tool?.form !== undefined && answer.form) && (props.recommendation.Tool?.url !== undefined && answer?.file)
});

const createOrEdit = async (form: any) => {

    if (!props.recommendation) {
        return;
    }

    const answer = props.recommendation.Answers?.at(0);

    const data = new FormData();
    data.append('form', JSON.stringify(form));

    try {
        // TODO: get the answer for the current user
        if (answer) {
            await recommendationAnswerService.editRecommendationAnswer(data, answer.id);
            $toast.add({
                title: 'Success',
                description: 'Recommendation answer has been updated.',
                color: 'success'
            });
        } else {
            data.append('recommendationId', props.recommendation.id.toString());
            await recommendationAnswerService.createRecommendationAnswer(data);
            $toast.add({
                title: 'Success',
                description: 'Recommendation answer has been saved.',
                color: 'success'
            });
        }
    } catch (error) {
        $toast.add({
            title: 'Error',
            description: `${error}`,
            color: 'error'
        });
    } finally {
        modalOpened.value = false;
    }
};

// const coverUrl = computed(() => {
//     return `${config.public.apiBase}/${props.tool.cover.replace("\\","\/")}`;
// });

</script>

<template>
    <UCard variant="soft" class="h-full w-full max-w-sm mx-auto shadow-lg flex flex-cols border" :ui="{ body: 'p-0!' }">
        <!-- <div :style="`background-image: url(${coverUrl});`" class="h-48 bg-cover bg-no-repeat rounded-t-lg" /> -->
        <div class="p-4 sm:p-6 flex flex-col h-full">
            <div class="flex justify-end">
                <UBadge class="font-bold rounded-full" variant="soft" size="xs"
                    :color="recommendationIsDone ? 'primary' : 'error'">
                    {{ recommendationIsDone ? 'Done' : 'Pending' }}
                </UBadge>
            </div>
            <div class="text-lg font-bold">
                {{ props.tool.title }}
            </div>
            <i class="text-sm">
                {{ props.tool.type }}
            </i>
            <p class="my-4 flex-grow">
                {{ props.tool.description }}
            </p>
            <div class="flex justify-end mb-3">
                <UBadge v-for="tag in tags" size="sm" class="font-bold rounded-full ml-2" :key="tag" variant='soft'>
                    {{ tag }}
                </UBadge>
            </div>
            <div>
                <template v-if="tool.form">
                    <UModal v-model:open="modalOpened" :title="tool.title" :description="tool.description">
                        <UButton label="Fill in Form" icon="lucide-edit" class="mb-2" size="sm" />
                        <template #body>
                            <QuestionnaireForm :questionnaire="tool.form" :answer="recommendationAnswer?.form" @on-submit="createOrEdit" />
                        </template>
                    </UModal>
                </template>
                <template v-if="tool.url">
                    <div>
                        <UButton :to="tool.url" label="Visit Tool" icon="lucide-external-link" size="sm" variant="outline"
                            target="_blank" aria-placeholder="ss" />
                        <UInput :id="`recommendation-file-${recommendation?.id}`" type="file" size="sm" class="mt-2"
                            icon="lucide-upload" />
                        <label :for="`recommendation-file-${recommendation?.id}`" class="text-xs text-gray-400 ml-1">
                            Upload tool's output
                        </label>
                    </div>
                </template>
            </div>
        </div>
    </UCard>

</template>
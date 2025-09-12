<script lang="ts" setup>
import { toast } from '#build/ui';
import { RecommendationAnswerService } from '~/services/recommendationAnswer';
import { isRecommendationDone } from '~/utils/helpers';

const props = defineProps<{
    tool: Tool;
    recommendation?: Recommendation | undefined; // Optional, if you want to pass a recommendation
    answer?: RecommendationAnswer | undefined;
    index: number;
}>();

const emits = defineEmits(["updateAnswer"])

const auth = useAuthStore();
const modalOpened = ref(false);
const config = useRuntimeConfig();
const $toast = useToast();
const recommendationAnswerService = new RecommendationAnswerService(config.public.apiBase as string);

const tags = computed(() => {
    return props.tool.tags?.split(",");
});

const recommendationIsDone = computed(() => {
    return isRecommendationDone(props.recommendation, props.answer);
});

const uploadFileMessage = computed(() => {
    if (!props.recommendation) return '';
    return props.answer?.file ? props.answer?.file.replaceAll('\\', '/').split('/').at(-1) : 'Upload tool\'s output';
});

const fillInFormMessage = computed(() => {
    if (!props.recommendation) return '';
    return props.answer?.form ? 'Edit Form' : 'Fill in Form';
});

const submitForm = async (form: any) => {

    if (!props.recommendation) {
        return;
    }

    if (!auth.token) {
        $toast.add({
            title: 'Error',
            description: `You have to be logged in!`,
            color: 'error'
        });
        return;
    }

    const data = new FormData();
    data.append('form', JSON.stringify(form));

    try {
        // TODO: get the answer for the current user
        let newRecommendationAnswer;
        if (props.answer) {
            newRecommendationAnswer = await recommendationAnswerService.editRecommendationAnswer(data, props.answer.id);
        } else {
            data.append('recommendationId', props.recommendation.id.toString());
            newRecommendationAnswer = await recommendationAnswerService.createRecommendationAnswer(data);
        }

        $toast.add({
            title: 'Success',
            description: 'Form has been submitted.',
            color: 'success'
        });

        // TODO: edit answer so reactive parent changes it
        emits("updateAnswer", newRecommendationAnswer, props.index);

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

const uploadFile = async (event: Event) => {
    if (!props.recommendation) return;

    if (!auth.token) {
        $toast.add({
            title: 'Error',
            description: `You have to be logged in!`,
            color: 'error'
        });
        return;
    }

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const data = new FormData();
    data.append('file', file);

    let newRecommendationAnswer;

    try {
        if (props.answer) {
            newRecommendationAnswer = await recommendationAnswerService.editRecommendationAnswer(data, props.answer.id);
        } else {
            data.append('recommendationId', props.recommendation.id.toString());
            newRecommendationAnswer = await recommendationAnswerService.createRecommendationAnswer(data);
        }

        $toast.add({
            title: 'Success',
            description: 'File has been uploaded successfully.',
            color: 'success'
        });

        // TODO: same
        emits("updateAnswer", newRecommendationAnswer, props.index)

    } catch (error) {
        $toast.add({
            title: 'Error',
            description: `${error}`,
            color: 'error'
        });
    }
};

onMounted(() => {
    if (auth.token) {
        recommendationAnswerService.setToken(auth.token);
    }
})


</script>

<template>
    <UCard variant="soft" class="h-full w-full max-w-sm mx-auto shadow-lg flex flex-cols border" :ui="{ body: 'p-0!' }">
        <div class="p-4 sm:p-6 flex flex-col h-full">
            <div v-if="recommendation" class="flex justify-end">
                <UBadge class="font-bold rounded-full" variant="soft" size="xs"
                    :color="recommendationIsDone ? 'primary' : 'error'">
                    {{ recommendationIsDone ? 'Done' : 'Pending' }}
                </UBadge>
            </div>
            <div class="text-lg font-bold">
                {{ props.tool.title }}
            </div>
            <i v-if="props.tool.type" class="text-sm">
                {{ props.tool.type }}
            </i>
            <p class="my-4 flex-grow">
                {{ props.tool.description }}
            </p>
            <div v-if="tags" class="flex justify-end mb-3">
                <UBadge v-for="tag in tags" size="sm" class="font-bold rounded-full ml-2" :key="tag" variant='soft'>
                    {{ tag }}
                </UBadge>
            </div>
            <div>
                <template v-if="recommendation && tool.form">
                    <UModal v-model:open="modalOpened" :title="tool.title" :description="tool.description">
                        <UButton :label="fillInFormMessage" icon="lucide-edit" class="mb-2" size="sm" />
                        <template #body>
                            <QuestionnaireForm :questionnaire="tool.form" :answer="answer?.form"
                                @on-submit="submitForm" />
                        </template>
                    </UModal>
                </template>
                <template v-if="tool.url">
                    <div>
                        <UButton :to="tool.url" label="Visit Tool" icon="lucide-external-link" size="sm"
                            variant="outline" target="_blank" aria-placeholder="ss" />
                        <template v-if="recommendation">
                            <UInput :id="`recommendation-file-${recommendation?.id}`" type="file" size="sm" class="mt-2"
                                icon="lucide-upload" @change="uploadFile" />
                            <label :for="`recommendation-file-${recommendation?.id}`" class="text-xs text-gray-400">
                                {{ uploadFileMessage }}
                            </label>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </UCard>

</template>
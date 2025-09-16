<script lang="ts" setup>
import { RecommendationAnswerService } from '~/services/recommendationAnswer';
import { isRecommendationDone } from '~/utils/helpers';

const tool = defineModel<Tool>('tool', { required: true });
const recommendation = defineModel<Recommendation>('recommendation');
const answer = defineModel<RecommendationAnswer>('answer');

const auth = useAuthStore();
const modalOpened = ref(false);
const config = useRuntimeConfig();
const $toast = useToast();
const recommendationAnswerService = new RecommendationAnswerService(config.public.apiBase as string);

const tags = computed(() => {
    return tool.value.tags?.split(",");
});

const recommendationIsDone = computed(() => {
    return isRecommendationDone(recommendation.value, answer.value);
});

const uploadFileMessage = computed(() => {
    if (!recommendation.value) return '';
    return answer.value?.file ? answer.value?.file.replaceAll('\\', '/').split('/').at(-1) : 'Upload tool\'s output';
});

const fillInFormMessage = computed(() => {
    if (!recommendation.value) return '';
    return answer.value?.form ? 'Edit Form' : 'Fill in Form';
});

const submitForm = async (form: any) => {
    if (!recommendation.value) {
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
        if (answer.value) {
            newRecommendationAnswer = await recommendationAnswerService.editRecommendationAnswer(data, answer.value.id);
        } else {
            data.append('recommendationId', recommendation.value.id.toString());
            newRecommendationAnswer = await recommendationAnswerService.createRecommendationAnswer(data);
        }

        $toast.add({
            title: 'Success',
            description: 'Form has been submitted.',
            color: 'success'
        });

        answer.value = newRecommendationAnswer;

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
    if (!recommendation.value) return;

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
        if (answer.value) {
            newRecommendationAnswer = await recommendationAnswerService.editRecommendationAnswer(data, answer.value.id);
        } else {
            data.append('recommendationId', recommendation.value.id.toString());
            newRecommendationAnswer = await recommendationAnswerService.createRecommendationAnswer(data);
        }

        $toast.add({
            title: 'Success',
            description: 'File has been uploaded successfully.',
            color: 'success'
        });

        answer.value = newRecommendationAnswer;

    } catch (error) {
        $toast.add({
            title: 'Error',
            description: `${error}`,
            color: 'error'
        });
    }
};

const checkboxModel = computed({
    get() {
        return answer.value?.checked_done || false;
    },
    async set(value: boolean) {
        setRecommendationDoneTo(value);
    }
});

const setRecommendationDoneTo = async (value: boolean) => {
    if (!recommendation.value) return;

    if (!auth.token) {
        $toast.add({
            title: 'Error',
            description: `You have to be logged in!`,
            color: 'error'
        });
        return;
    }

    const data = new FormData();
    data.append('checked_done', value.toString());

    let newRecommendationAnswer;
    try {
        if (answer.value) {
            newRecommendationAnswer = await recommendationAnswerService.editRecommendationAnswer(data, answer.value.id);
        } else {
            data.append('recommendationId', recommendation.value.id.toString());
            newRecommendationAnswer = await recommendationAnswerService.createRecommendationAnswer(data);
        }

        answer.value = newRecommendationAnswer;

        if (answer.value?.checked_done) {
            $toast.add({
                title: 'Success',
                description: 'Recommended tool has been completed.',
                color: 'success'
            });
        } else {
            $toast.add({
                title: 'Info',
                description: 'Recommended tool has been updated.',
                color: 'info'
            });
        }
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
                {{ tool.title }}
            </div>
            <i v-if="tool.type" class="text-sm">
                {{ tool.type }}
            </i>
            <p class="my-4 flex-grow">
                {{ tool.description }}
            </p>
            <div v-if="tags" class="flex justify-end mb-3">
                <UBadge v-for="tag in tags" size="sm" class="font-bold rounded-full ml-2" :key="tag" variant='soft'>
                    {{ tag }}
                </UBadge>
            </div>
            <div class="flex flex-col gap-4 items-start">
                <template v-if="tool.url">
                    <UButton :to="tool.url" label="Visit Tool" icon="lucide-external-link" size="sm" variant="outline"
                        target="_blank" aria-placeholder="ss" />
                </template>
                <template v-if="recommendation && tool.form">
                    <UModal v-model:open="modalOpened" :title="tool.title" :description="tool.description">
                        <UButton :label="fillInFormMessage" icon="lucide-edit" size="sm" />
                        <template #body>
                            <QuestionnaireForm :questionnaire="tool.form" :answer="answer?.form"
                                @on-submit="submitForm" />
                        </template>
                    </UModal>
                </template>
                <template v-if="recommendation && tool.file_upload">
                    <UInput :id="`recommendation-file-${recommendation?.id}`" type="file" size="sm" class="mt-2"
                        icon="lucide-upload" @change="uploadFile" />
                    <label :for="`recommendation-file-${recommendation?.id}`" class="text-xs text-gray-400">
                        {{ uploadFileMessage }}
                    </label>
                </template>
                <template v-if="recommendation && !tool.file_upload && !tool.form">
                    <UCheckbox label="Completed" v-model="checkboxModel" class="py-1" />
                </template>
            </div>
        </div>
    </UCard>
</template>
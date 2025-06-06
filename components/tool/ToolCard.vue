<script lang="ts" setup>
const props = defineProps<{
    tool: Tool;
    recommendation?: Recommendation | null; // Optional, if you want to pass a recommendation   
}>();

const config = useRuntimeConfig();

const tags = computed(() => {
    return props.tool.tags.split(",");
});

const recommendationIsDone = computed(() => {
    if (!props.recommendation) return false;
    const answers = props.recommendation.Answers;

    if(!answers?.length) return false;

    // TODO: get answer from current user
    return answers[0].file || answers[0].form;
});

// const coverUrl = computed(() => {
//     return `${config.public.apiBase}/${props.tool.cover.replace("\\","\/")}`;
// });

</script>

<template>

    <UCard variant="soft" class="h-full w-full max-w-sm mx-auto shadow-lg flex flex-cols border" :ui="{ body: 'p-0!' }">
        <!-- <div :style="`background-image: url(${coverUrl});`" class="h-48 bg-cover bg-no-repeat rounded-t-lg" /> -->
            <div class="p-4 sm:p-6 flex flex-col h-full">
                <div class="flex justify-end">
                    <UBadge class="font-bold rounded-full" variant="soft" size="xs" :color="recommendationIsDone ? 'primary' : 'error'">
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
                    <template v-if="tool.url">
                        <UButton :to="tool.url" label="Visit Tool" class="mb-2" icon="lucide-external-link" size="sm" target="_blank" aria-placeholder="ss"/>
                        
                        <div>
                            <UInput :id="`recommendation-file-${recommendation?.id}`" type="file" size="sm" icon="lucide-upload"/>
                            <label :for="`recommendation-file-${recommendation?.id}`" class="text-xs text-gray-400 ml-1">
                                Upload tool's output
                            </label> 
                        </div>
                    </template>
        
                </div>
            </div>
    </UCard>

</template>
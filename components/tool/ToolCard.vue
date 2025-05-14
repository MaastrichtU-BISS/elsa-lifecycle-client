<script lang="ts" setup>
const props = defineProps<{
    tool: Tool;
}>();

const config = useRuntimeConfig();

const tags = computed(() => {
    return props.tool.tags.split(",");
});

// const coverUrl = computed(() => {
//     return `${config.public.apiBase}/${props.tool.cover.replace("\\","\/")}`;
// });

</script>

<template>

    <UCard variant="soft" class="h-full w-full max-w-sm mx-auto shadow-lg flex flex-cols border" :ui="{ body: 'p-0!' }">
        <!-- <div :style="`background-image: url(${coverUrl});`" class="h-48 bg-cover bg-no-repeat rounded-t-lg" /> -->
        <ULink :href="props.tool.url" target="_blank">
            <div class="p-4 sm:p-6 flex flex-col">
                <div class="text-lg font-bold">
                    {{ props.tool.title }}
                </div>
                <i class="text-sm">
                    {{ props.tool.type }}
                </i>
                <p class="my-4 flex-grow">
                    {{ props.tool.description }}
                </p>
                <div class="flex justify-end">
                    <UBadge v-for="tag in tags" class="font-bold rounded-full ml-2">
                        {{ tag }}
                    </UBadge>
                </div>
            </div>
        </ULink>
    </UCard>

</template>
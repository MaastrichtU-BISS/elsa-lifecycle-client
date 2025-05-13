<script lang="ts" setup>
const props = defineProps<{
    tool: Tool;
}>();

const config = useRuntimeConfig();

const coverUrl = computed(() => {
    return `${config.public.apiBase}/${props.tool.cover}`;
});

</script>

<template>
    <ULink :href="props.tool.url" target="_blank" class="block">
        <UCard variant="soft" class="h-full w-full max-w-sm mx-auto shadow-lg flex flex-cols border" :ui="{ body: 'p-0!'}">
            <div :style="`background-image: url(${coverUrl});`" class="h-48 bg-cover bg-no-repeat rounded-t-lg" />

            <div class="p-4 sm:p-6 flex flex-col">
                <div class="text-lg font-semibold">
                    {{ props.tool.title }}
                </div>
                <p class="mt-4 flex-grow">
                    {{ props.tool.description }}
                </p>
            </div>
        </UCard>
    </ULink>
</template>
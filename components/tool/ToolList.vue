<script lang="ts" setup>
// import { ref } from 'vue';
import type { Tool } from '~/utils/types';
// import { ToolService } from '~/services/tool';

const props = withDefaults(defineProps<{
    tools?: Tool[]
    title?: string
}>(), {
    tools: [],
    title: 'Tools',
});

// const toast = useToast();

// API calls
// const config = useRuntimeConfig();
// const service = new ToolService(config.public.apiBase as string);
// const tools = reactive<Tool[]>(await service.getAllTools());


// const loading = ref(false);

// const createTool = async (newTool: FormData) => {
//     loading.value = true;
//     try {
//         const response = await service.createTool(newTool);
//         tools.push(response);
//         toast.add({ title: 'Success', description: 'The tool has been created.', color: 'success' });
//     } catch (error) {
//         toast.add({ title: 'Error', description: error as string, color: 'error' });
//     } finally {
//         loading.value = false;
//     }
// };

// const deleteTool = async (tool: Tool) => {
//     loading.value = true;
//     try {
//         await service.deleteTool(tool.id);
//         const i = tools.indexOf(tool);
//         if (i >= 0) {
//             tools.splice(i, 1);
//         }
//         toast.add({ title: 'Success', description: 'The tool has been deleted.', color: 'success' });
//     } catch (error) {
//         toast.add({ title: 'Error', description: error as string, color: 'error' });
//     } finally {
//         loading.value = false;
//     }
// };

</script>

<template>

    <section id="list" class="flex flex-col gap-4">

        <h2 class="text-2xl font-bold text-center">{{ title }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            <template v-for="tool in tools" :key="tool.id">
                <ToolCard :tool="tool" />
            </template>
        </div>

    </section>

    <!-- <section id="form" class="my-8">
        <h2 class="text-center text-xl font-bold">Add a new tool</h2>
        <ToolForm @create="createTool" />
    </section> -->

</template>
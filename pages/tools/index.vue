<script lang="ts" setup>
import type { Tool } from '~/utils/types';
import { ToolService } from '~/services/tool';
import ToolList from '~/components/tool/ToolList.vue';

const config = useRuntimeConfig();
const service = new ToolService(config.public.apiBase as string);
const tools = reactive<Tool[]>(await service.getAllTools());


const currentFilter = ref<string>('');
const filteredTools = computed(() => {
  return tools.filter((tool) => tool.title.toLowerCase().includes(currentFilter.value.toLowerCase()) || 
         tool.description.toLowerCase().includes(currentFilter.value.toLowerCase()) || 
         tool.tags?.split(',').some(tag => tag.toLowerCase().includes(currentFilter.value.toLowerCase())));
});

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold my-4 text-center">Tools</h1>
    <UInput icon="i-lucide-search" v-model="currentFilter" placeholder="Search tools..."
      class="my-4 lg:w-1/3 w-100" />
    <ToolList :tools="filteredTools" />
  </div>
</template>
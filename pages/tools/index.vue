<script lang="ts" setup>
import type { Tool } from '~/utils/types';
import { ToolService } from '~/services/tool';
import ToolList from '~/components/tool/ToolList.vue';

const config = useRuntimeConfig();
const service = new ToolService(config.public.apiBase as string);
const tools = reactive<Tool[]>(await service.getAllTools());

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold my-4 text-center">Tools</h1>
    <ToolList :tools="tools" />
  </div>
</template>
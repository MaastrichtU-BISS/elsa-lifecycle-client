<script lang="ts" setup>
import { ref } from 'vue';
import type { Questionnaire } from '~/utils/types';
import { QuestionnaireService } from '~/services/questionnaire';
import { getPaginationRowModel } from '@tanstack/vue-table';

const config = useRuntimeConfig();

const service = new QuestionnaireService(config.public.apiBase as string);
const loadingTable = ref(false);
const questionnaires = ref<Questionnaire[]>(await service.getAllQuestionnaires());

const table = useTemplateRef('table')

const pagination = ref({
    pageIndex: 0,
    pageSize: 10
});

const rows = computed(() => {
    return questionnaires.value.map(q => q);
});

const createQuestionnaire = async (newQuestionnaire: Omit<Questionnaire, "id">) => {
    loadingTable.value = true;
    const response = await service.createQuestionnaire(newQuestionnaire);
    questionnaires.value.push(response);
    loadingTable.value = false;
};

</script>

<template>

    <UTable ref="table" v-model:pagination="pagination" :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
    }" :data="rows" :loading="loadingTable" class="flex-1 mb-4" />

    <div class="flex justify-center border-t border-(--ui-border) pt-4">
        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
    </div>

    <QuestionnaireNew @create="createQuestionnaire" />

</template>
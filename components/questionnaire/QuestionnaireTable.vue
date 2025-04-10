<script lang="ts" setup>
import { ref } from 'vue';
import type { Questionnaire } from '~/utils/types';
import { QuestionnaireService } from '~/services/questionnaire';
import type { TableColumn } from '@nuxt/ui';
import { getPaginationRowModel } from '@tanstack/vue-table';
import { h, resolveComponent } from 'vue';

// API calls

const config = useRuntimeConfig();
const service = new QuestionnaireService(config.public.apiBase as string);

const createQuestionnaire = async (newQuestionnaire: Omit<Questionnaire, "id">) => {
    loadingTable.value = true;
    const response = await service.createQuestionnaire(newQuestionnaire);
    questionnaires.push(response);
    loadingTable.value = false;
};

// Table setup

const loadingTable = ref(false);
const questionnaires = reactive<Questionnaire[]>(await service.getAllQuestionnaires());

const table = useTemplateRef('table')

const pagination = ref({
    pageIndex: 0,
    pageSize: 10
});

const rows = computed(() => {
    return questionnaires.map(q => q);
});

const columns: TableColumn<Questionnaire>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
        cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'formName',
        header: 'Form',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return h('div', { class: 'flex gap-2' }, [
                h(resolveComponent('UButton'), {
                    label: 'View',
                    icon: 'i-lucide-eye',
                    color: 'primary',
                    variant: 'outline',
                    size: 'sm',
                    to: `/questionnaires/${row.original.id}`
                }),
                h(resolveComponent('UButton'), {
                    label: 'Remove',
                    icon: 'i-lucide-trash',
                    color: 'error',
                    variant: 'outline',
                    size: 'sm',
                    onClick: () => {
                        const questionnaire = row.original as Questionnaire;
                        // Handle delete action
                        console.log('Delete questionnaire', questionnaire);
                    }
                })
            ]
            );
        }
    }]
</script>

<template>

    <UTable ref="table" v-model:pagination="pagination" :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
    }" :data="rows" :columns="columns" :loading="loadingTable" class="flex-1 mb-4" />

    <div class="flex justify-center border-t border-(--ui-border) pt-4">
        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
    </div>

    <QuestionnaireNew @create="createQuestionnaire" />

</template>
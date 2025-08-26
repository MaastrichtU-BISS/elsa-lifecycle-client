<script lang="ts" setup>
import { ref } from 'vue';
import type { Lifecycle } from '~/utils/types';
import type { TableColumn } from '@nuxt/ui';
import { getPaginationRowModel } from '@tanstack/vue-table';
import { h, resolveComponent } from 'vue';

// API calls

const props = defineProps<{
    lifecycles: Lifecycle[]
}>();

// Table setup

const loadingTable = ref(false);

const table = useTemplateRef('table')

const pagination = ref({
    pageIndex: 0,
    pageSize: 10
});

const rows = computed(() => {
    return props.lifecycles.map(a => a);
});

const columns: TableColumn<Lifecycle>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
        cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => `${row.getValue('title')}`
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => `${row.getValue('description')}`
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
                    to: `/lifecycles/${row.original.id}`
                }),
                // h(resolveComponent('UButton'), {
                //     label: 'Remove',
                //     icon: 'i-lucide-trash',
                //     color: 'error',
                //     variant: 'outline',
                //     size: 'sm',
                //     onClick: () => {
                //         const questionnaire = row.original as Answer;
                //         // Handle delete action
                //         console.log('Delete questionnaire', questionnaire);
                //     }
                // })
            ]
            );
        }
    }]
</script>

<template>

    <UTable ref="table" v-model:pagination="pagination" :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
    }" :data="rows" :columns="columns" :loading="loadingTable" class="flex-1 mb-4 mx-auto w-3xl" />

    <div class="flex justify-center border-t border-(--ui-border) pt-4 mx-auto w-3xl">
        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
    </div>

</template>
<script lang="ts" setup>
// import { ref } from 'vue';
// import type { Questionnaire } from '~/utils/types';
// import { QuestionnaireService } from '~/services/reflection';
// import type { TableColumn } from '@nuxt/ui';
// import { getPaginationRowModel } from '@tanstack/vue-table';
// import { h, resolveComponent } from 'vue';

// const toast = useToast();

// // API calls

// const config = useRuntimeConfig();
// const service = new QuestionnaireService(config.public.apiBase as string);

// // const createQuestionnaire = async (newQuestionnaire: Omit<Questionnaire, "id">) => {
// //     loadingTable.value = true;
// //     try {
// //         const response = await service.createQuestionnaire(newQuestionnaire);
// //         questionnaires.push(response);
// //         toast.add({ title: 'Success', description: 'The questionnaire has been created.', color: 'success' });
// //     } catch (error) {
// //         toast.add({ title: 'Error', description: error as string, color: 'error' });
// //     } finally {
// //         loadingTable.value = false;
// //     }
// // };

// const deleteQuestionnaire = async (questionnaire: Questionnaire) => {
//     loadingTable.value = true;
//     try {
//         await service.deleteQuestionnaire(questionnaire.id);
//         const i = questionnaires.indexOf(questionnaire);
//         if (i >= 0) {
//             questionnaires.splice(i, 1);
//         }
//         toast.add({ title: 'Success', description: 'The questionnaire has been deleted.', color: 'success' });
//     } catch (error) {
//         toast.add({ title: 'Error', description: error as string, color: 'error' });
//     } finally {
//         loadingTable.value = false;
//     }
// };

// // Table setup

// const loadingTable = ref(false);
// const questionnaires = reactive<Questionnaire[]>(await service.getAllQuestionnaires());

// const table = useTemplateRef('table')

// const pagination = ref({
//     pageIndex: 0,
//     pageSize: 10
// });

// const rows = computed(() => {
//     return questionnaires.map(q => q);
// });

// const columns: TableColumn<Questionnaire>[] = [
//     {
//         accessorKey: 'id',
//         header: 'Id',
//         cell: ({ row }) => `#${row.getValue('id')}`
//     },
//     {
//         accessorKey: 'name',
//         header: 'Name',
//     },
//     {
//         accessorKey: 'description',
//         header: 'Description',
//     },
//     {
//         accessorKey: 'formName',
//         header: 'Form',
//     },
//     {
//         id: 'actions',
//         header: 'Actions',
//         cell: ({ row }) => {
//             return h('div', { class: 'flex gap-2' }, [
//                 h(resolveComponent('UButton'), {
//                     label: 'View',
//                     icon: 'i-lucide-eye',
//                     color: 'primary',
//                     variant: 'outline',
//                     size: 'sm',
//                     to: `/questionnaires/${row.original.id}`
//                 }),
//                 h(resolveComponent('UButton'), {
//                     label: 'Remove',
//                     icon: 'i-lucide-trash',
//                     color: 'error',
//                     variant: 'outline',
//                     size: 'sm',
//                     onClick: () => { deleteQuestionnaire(row.original as Questionnaire) }
//                 })
//             ]
//             );
//         }
//     }]
</script>

<template>
    <span></span>
<!-- 
    <section id="table">
        <h1 class="text-3xl font-bold text-center my-4">Questionnaires</h1>
        <UTable ref="table" v-model:pagination="pagination" :pagination-options="{
            getPaginationRowModel: getPaginationRowModel()
        }" :data="rows" :columns="columns" :loading="loadingTable" class="flex-1 mb-4 mx-auto w-3xl" />

        <div class="flex justify-center border-t border-(--ui-border) pt-4 mx-auto w-3xl">
            <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                :total="table?.tableApi?.getFilteredRowModel().rows.length"
                @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
        </div>
    </section> -->

    <!-- <section id="form">
        <h2 class="text-xl font-bold text-center mt-8">Create Questionnaire</h2>
        <QuestionnaireNew @create="createQuestionnaire" />
    </section> -->

</template>
<style>
table,
td {
    white-space: pre-wrap;
}
</style>
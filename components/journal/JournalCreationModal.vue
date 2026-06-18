<script setup lang="ts">
import { LifecycleService } from '~/services/lifecycle';
import { JournalService } from '~/services/journal';
import type { Lifecycle, Journal } from '~/utils/types';

const config = useRuntimeConfig();
const toast = useToast();

const emits = defineEmits(['journal-created']);
const props = defineProps({
    journalService: {
        type: JournalService,
        required: true
    }
});

const lifecycleService = new LifecycleService(config.public.apiBase as string);
const lifecycles: Lifecycle[] = await lifecycleService.getAllLifecycles();
const lifeCyclesOptions = ref(lifecycles.map(lifecycle => ({ label: lifecycle.title, value: lifecycle.id })));

const selectedLifecycle = computed(() => {
    return lifecycles.find(lifecycle => lifecycle.id === newJournal.value.lifecycleId);
});

const newJournal = ref<Omit<Journal, 'id' | 'userId'>>({
    title: '',
    lifecycleId: lifecycles[0].id,
});

const showModal = ref();

const createNewJournal = async () => {

    if (!newJournal.value.title || !newJournal.value.lifecycleId) {
        toast.add({ title: 'Error', description: 'Please fill in all fields.', color: 'error' });
        return;
    }

    try {
        const response = await props.journalService.createJournal(newJournal.value);
        emits('journal-created', response);
        newJournal.value = { title: '', lifecycleId: lifecycles[0].id };
        showModal.value = false;
        toast.add({ title: 'Success', description: 'New journal created successfully!', color: 'success' });
    } catch (error) {
        toast.add({ title: 'Error', description: 'Error creating new journal.', color: 'error' });
    }
}

</script>

<template>
    <UModal v-model:open="showModal" :title="'Create New Journal'"
        :description="'Fill in the title and select a template to create a new journal.'"
        :ui="{ footer: 'justify-center gap-4' }">
        <UButton class="mt-4" color="primary" icon="i-lucide-plus" size="lg">Create New Journal</UButton>

        <template #body>
            <p class="text-sm font-medium mb-2">Title:</p>
            <UInput v-model="newJournal.title" placeholder="My new journal" class="w-full mb-4" />
            <p class="text-sm font-medium mb-2">Template:</p>
            <USelect v-model="newJournal.lifecycleId" :items="lifeCyclesOptions" class="w-full mb-4" />
            <p class="text-sm text-gray-500">{{ selectedLifecycle?.description }}</p>
        </template>
        <template #footer>
            <UButton color="primary" variant="outline" icon="i-lucide-x" size="lg" @click="showModal = false">Cancel
            </UButton>
            <UButton color="primary" icon="i-lucide-check" size="lg" @click="createNewJournal">Create</UButton>
        </template>
    </UModal>
</template>

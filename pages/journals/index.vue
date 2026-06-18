<script setup lang="ts">
import { LifecycleService } from '~/services/lifecycle';
import { JournalService } from '~/services/journal';
import type { Lifecycle, Journal } from '~/utils/types';
import JournalsTable from '~/components/lifecycle/JournalsTable.vue';

const auth = useAuthStore();
const toast = useToast();

const config = useRuntimeConfig();
const lifecycleService = new LifecycleService(config.public.apiBase as string);
const journalService = new JournalService(config.public.apiBase as string);
const journals = ref<Journal[]>();

onMounted(async () => {
    if (auth.token) {
        lifecycleService.setToken(auth.token);
        journalService.setToken(auth.token);
        journals.value = await journalService.getAllJournals();
    }
});

watch(() => auth.token, async (newToken) => {
    if (newToken) {
        lifecycleService.setToken(newToken);
        journalService.setToken(newToken);
        journals.value = await journalService.getAllJournals();
    } else {
        journals.value = [];
    }
});


const createNewJournal = async () => {
    try {

        const lifecycles: Lifecycle[] = await lifecycleService.getAllLifecycles();
        const newJournal = await journalService.createJournal({ title: 'New Journal', lifecycleId: lifecycles[0].id });
        journals.value?.push(newJournal);

        toast.add({ title: 'Success', description: 'New journal created successfully!', color: 'success' });
    } catch (error) {
        toast.add({ title: 'Error', description: 'Error creating new journal.', color: 'error' });
    }
}

</script>
<template>
    <div>
        <section>
            <h1 class="text-2xl font-bold mt-8 mb-4 text-center">My Journals</h1>
            <template v-if="auth.token">
                
                <template v-if="journals && journals.length > 0">
                    <JournalsTable :journals="journals" />
                </template>
                <template v-else>
                    <UAlert icon="i-lucide-info" color="warning" variant="subtle" title="You have no journals yet"
                        description="Create your first journal to get started." class="mb-4" />
                </template>

                <UButton class="mt-4" color="primary" icon="i-lucide-plus" size="lg" @click="createNewJournal">Create a new Journal</UButton>
            </template>
            <template v-else>
                <UAlert icon="i-lucide-info" color="warning" variant="subtle" title="Please log in to continue"
                    description="You need to be logged in order to see your journals or create a new one."
                    class="mb-4" />
            </template>
        </section>
    </div>
</template>
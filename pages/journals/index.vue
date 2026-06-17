<script setup lang="ts">
import { LifecycleService } from '~/services/lifecycle';
import { JournalService } from '~/services/journal';
import type { Lifecycle, Journal } from '~/utils/types';

const auth = useAuthStore();

const config = useRuntimeConfig();
const lifecycleService = new LifecycleService(config.public.apiBase as string);
const journalService = new JournalService(config.public.apiBase as string);
const journals = ref<Journal[]>([]);

onMounted(async () => {
    if (auth.token) {
        lifecycleService.setToken(auth.token);
        journalService.setToken(auth.token);
        journals.value = await journalService.getAllJournals();
    }
});


const createNewJournal = async () => {
    try {

        const lifecycles: Lifecycle[] = await lifecycleService.getAllLifecycles();

        console.log('Lifecycles:', lifecycles);


        const newJournal = await journalService.createJournal({ title: 'New Journal', lifecycleId: lifecycles[0].id });
        journals.value.push(newJournal);
    } catch (error) {
        console.error('Error creating new journal:', error);
    }
}

</script>
<template>
    <div>
        <section>
            <h1 class="text-2xl font-bold mt-8 mb-4 text-center">My Journals</h1>
            <template v-if="auth.token">
                <button class="mt-4" @click="createNewJournal">Create a new Journal</button>
                <!-- <JournalTable :journals="journals" /> -->
            </template>
            <template v-else>
                <UAlert icon="i-lucide-info" color="warning" variant="subtle" title="Please log in to continue"
                    description="You need to be logged in order to see your journals or create a new one." class="mb-4" />
            </template>
        </section>
    </div>
</template>
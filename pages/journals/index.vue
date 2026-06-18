<script setup lang="ts">
import { JournalService } from '~/services/journal';
import type { Journal } from '~/utils/types';
import JournalsTable from '~/components/journal/JournalsTable.vue';
import JournalCreationModal from '~/components/journal/JournalCreationModal.vue';

const auth = useAuthStore();

const config = useRuntimeConfig();
const journalService = new JournalService(config.public.apiBase as string);
const journals = ref<Journal[]>([]);

const loadedJournals = ref(false);

const initJournals = async (token: string) => {
    if (!loadedJournals.value) {
        loadedJournals.value = true;
        journalService.setToken(token);
        journals.value = await journalService.getAllJournals();
    }
};

onMounted(async () => {
    if (auth.token) {
        await initJournals(auth.token);
    }
});

watch(() => auth.token, async (newToken) => {
    if (newToken) {
        await initJournals(newToken);
    } else {
        journals.value = [];
    }
});

</script>
<template>
    <div>
        <section>
            <h1 class="text-2xl font-bold mt-8 mb-4 text-center">My Journals</h1>
            <template v-if="auth.token">
                <template v-if="journals?.length > 0">
                    <JournalsTable :journals="journals" />
                </template>
                <template v-else>
                    <UAlert icon="i-lucide-info" color="warning" variant="subtle" title="You have no journals yet"
                        description="Create your first journal to get started." class="mb-4" />
                </template>

                <JournalCreationModal :journal-service="journalService" @journal-created="journals.push($event)" />
            </template>
            <template v-else>
                <UAlert icon="i-lucide-info" color="warning" variant="subtle" title="Please log in to continue"
                    description="You need to be logged in order to see your journals or create a new one."
                    class="mb-4" />
            </template>
        </section>
    </div>
</template>
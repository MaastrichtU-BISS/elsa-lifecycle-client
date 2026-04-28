<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { LifecycleService } from '~/services/lifecycle';

const auth = useAuthStore();
const config = useRuntimeConfig();

const lastLifecycleId = ref<number | undefined>(undefined);
const lifecycleService = new LifecycleService(config.public.apiBase);
const loading = ref(true);

const loadLastLifecycle = async () => {
  if (auth.token) {
    lifecycleService.setToken(auth.token);
    const result = await lifecycleService.getLastLifecycleForUser();
    lastLifecycleId.value = result?.id;
  }
  loading.value = false;
};

watch(() => auth.token, async (newToken) => {
  if (newToken) {
    loadLastLifecycle();
  }
});

onMounted(async () => {
  loadLastLifecycle();
});

</script>

<template>
    <div>
        <div v-if="auth.token">
            <div
                class="max-w-xl mx-auto mt-12 p-6 bg-blue-50 border border-blue-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow flex flex-col items-center">
                <div class="flex items-center mb-3">
                    <svg class="w-7 h-7 text-blue-400 dark:text-white mr-2" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                        <path d="M9 12l2 2l4 -4" stroke="currentColor" stroke-width="2" fill="none"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <h2 class="text-xl font-semibold text-blue-700 dark:text-white">Continue where you left off</h2>
                </div>
                <p class="text-blue-600 dark:text-white mb-4 text-center">Welcome back! You can quickly return to your last lifecycle
                    below.</p>
                <NuxtLink v-show="lastLifecycleId" :to="`/lifecycles/${lastLifecycleId}`"
                    class="px-6 py-3 bg-blue-600 text-white dark:text-white rounded-lg font-medium shadow hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">
                    Continue to your last lifecycle
                </NuxtLink>
                <NuxtLink v-show="!lastLifecycleId" to="/lifecycles" class="text-blue-600 dark:text-white underline mt-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    Go to Lifecycles to start a new one
                </NuxtLink>
            </div>
        </div>
        <div v-else-if="!loading">
            <div class="mt-50 flex flex-col sm:flex-row gap-6 justify-center items-center">
                <NuxtLink to="/lifecycles"
                    class="w-64 h-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col justify-center items-center border border-primary hover:bg-primary hover:text-white transition-colors duration-200">
                    <i class="i-lucide:recycle text-2xl mb-2"></i>
                    <span class="text-2xl font-semibold mb-2">Lifecycles</span>
                    <span class="text-sm">Explore all available lifecycles</span>
                </NuxtLink>
                <NuxtLink to="/tools"
                    class="w-64 h-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col justify-center items-center border border-primary hover:bg-primary hover:text-white transition-colors duration-200">
                    <i class="i-lucide:wrench text-2xl mb-2"></i>
                    <span class="text-2xl font-semibold mb-2">Tools</span>
                    <span class="text-sm">Browse our tool collection</span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
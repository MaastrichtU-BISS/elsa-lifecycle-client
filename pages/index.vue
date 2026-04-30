<script setup lang="ts">
import { computed, watch } from 'vue'
import { LifecycleService } from '~/services/lifecycle'
import { useLifecycleStore } from '~/stores/lifecycle'

const auth = useAuthStore()
const config = useRuntimeConfig()
const lifecycleService = new LifecycleService(config.public.apiBase)

const lifecycleStore = useLifecycleStore()
lifecycleStore.hydrateFromLocalStorage()


const CACHE_MAX_AGE = 10 * 60 * 1000

const { data: lastLifecycle, pending: loading, refresh } = await useLazyAsyncData(
    'lastLifecycle',
    async () => {
        if (!auth.initialized || !auth.token) return null
        if (lifecycleStore.isLastLifecycleFresh(CACHE_MAX_AGE) && lifecycleStore.lastLifecycle) {
            return lifecycleStore.lastLifecycle
        }
        lifecycleService.setToken(auth.token)
        const data = await lifecycleService.getLastLifecycleForUser()
        const plain = data ? JSON.parse(JSON.stringify(data)) : null
        lifecycleStore.setLastLifecycle(plain)
        return plain
    },
    {
        default: () => lifecycleStore.lastLifecycle,
        watch: [() => auth.token, () => auth.initialized],
        server: false
    }
)

watch(lastLifecycle, (value) => {
    if (value) {
        lifecycleStore.setLastLifecycle(value)
    } else {
        lifecycleStore.clearLastLifecycle()
    }
})

const isLoading = computed(() => !lastLifecycle.value && (loading.value || !auth.initialized))

const lastLifecycleLink = computed(() => {
    const data = lastLifecycle.value
    if (!data?.lifecycleId || !data?.phaseTitle) return null
    return `/lifecycles/${data.lifecycleId}#phase-${encodeURIComponent(data.phaseTitle)}`
})

defineProps({})
</script>

<template>
    <div>
        <ClientOnly>
            <div v-if="isLoading" class="min-h-[300px] flex justify-center items-center">
                <Icon name="lucide:loader" class="animate-spin text-4xl text-primary" />
            </div>
            <div v-else-if="auth.token && lastLifecycle">
                <div class="max-w-xl mx-auto mt-12 p-6
                 bg-primary/10 border border-primary/20
                 dark:bg-gray-800 dark:border-gray-700
                 rounded-xl shadow flex flex-col items-center">
                    <div class="flex items-center mb-4 gap-2">
                        <Icon name="lucide:clock" class="text-3xl text-primary dark:text-white" />
                        <h2 class="text-xl font-semibold text-primary dark:text-white">
                            Continue where you left off
                        </h2>
                    </div>
                    <p class="text-primary dark:text-white mb-4 text-center">
                        You were last working on
                        <span class="font-semibold text-primary dark:text-primary-light">
                            {{ lastLifecycle?.lifecycleTitle || 'your last lifecycle' }}
                        </span>.
                        Pick up right where you stopped.
                    </p>
                    <NuxtLink v-if="lastLifecycleLink" :to="lastLifecycleLink" class="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow
                 hover:bg-primary-dark transition-all duration-200
                 hover:-translate-y-0.5 hover:shadow-lg">
                        Continue to your last lifecycle
                    </NuxtLink>
                    <NuxtLink v-else to="/lifecycles"
                        class="text-primary underline mt-2 hover:text-primary-dark transition-colors">
                        Go to Lifecycles to start a new one
                    </NuxtLink>
                </div>
            </div>
            <div v-else>
                <div class="mt-50 flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <NuxtLink to="/lifecycles" class="w-64 h-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg
                 flex flex-col justify-center items-center
                 border border-primary
                 hover:bg-primary hover:text-white
                 transition-colors duration-200">
                        <Icon name="lucide:recycle" class="text-2xl mb-2" />
                        <span class="text-2xl font-semibold mb-2">Lifecycles</span>
                        <span class="text-sm">Explore all available lifecycles</span>
                    </NuxtLink>
                    <NuxtLink to="/tools" class="w-64 h-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg
                 flex flex-col justify-center items-center
                 border border-primary
                 hover:bg-primary hover:text-white
                 transition-colors duration-200">
                        <Icon name="lucide:wrench" class="text-2xl mb-2" />
                        <span class="text-2xl font-semibold mb-2">Tools</span>
                        <span class="text-sm">Browse our tool collection</span>
                    </NuxtLink>
                </div>
            </div>
        </ClientOnly>
    </div>
</template>
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
    if (!data?.lifecycleId || !data?.reflectionTitle) return null
    return `/lifecycles/${data.lifecycleId}#phase${encodeURIComponent(data.reflectionTitle)}-reflection`
})
</script>

<template>
    <div class="home-page">
        <div class="home-content">
            <ClientOnly>
                <HomeHeroSection
                    :is-authenticated="Boolean(auth.token)"
                    :is-loading="isLoading"
                    :last-lifecycle="lastLifecycle"
                    :last-lifecycle-link="lastLifecycleLink"
                />
            </ClientOnly>
            <HomeWhatIsSection />
            <HomeWhySection />
            <HomeHowSection />
            <HomeCtaSection :is-authenticated="Boolean(auth.token)" />
        </div>
    </div>
</template>

<style scoped>
.home-page {
    padding: 1rem 0 2rem;
}

.home-content {
    width: min(1560px, 100%);
    margin: 0 auto;
    padding: 0 clamp(0.5rem, 1.4vw, 1.2rem);
    display: grid;
    gap: clamp(1.25rem, 2.5vh, 3rem);
}
</style>
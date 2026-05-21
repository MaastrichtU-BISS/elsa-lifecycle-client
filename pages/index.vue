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
</template>

<style scoped>
.home-page {
    --ej-ink: #0f1117;
    --ej-ink-mid: #3a3d47;
    --ej-ink-light: #6b7080;
    --ej-cream: #f7f4ee;
    --ej-teal: #0d7a6b;
    --ej-teal-light: #def0ec;
    --ej-teal-dark: #085548;
    --ej-rule: rgba(15, 17, 23, 0.13);
    --ej-serif: 'Fraunces', 'DM Serif Display', Georgia, serif;

    width: 100vw;
    margin-left: calc(50% - 50vw);
    padding: 1rem clamp(1rem, 2.8vw, 2.2rem) 2.5rem;
    background:
        radial-gradient(circle at 12% 0%, rgba(13, 122, 107, 0.08), transparent 34%),
        linear-gradient(180deg, #ffffff, #f8f8f6 55%, #ffffff);
    display: grid;
    gap: 1rem;
    color: var(--ej-ink);
}

.home-page :deep(*) {
    font-family: 'Manrope', 'DM Sans', 'Segoe UI', sans-serif;
}

.home-page :deep(h1),
.home-page :deep(h2),
.home-page :deep(h3) {
    font-family: var(--ej-serif);
}
</style>
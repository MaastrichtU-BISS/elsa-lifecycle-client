<script setup lang="ts">
import { ref, watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'

const auth = useAuthStore()


const landingRef = ref<HTMLElement | null>(null)
const whatRef = ref<HTMLElement | null>(null)
const whyRef = ref<HTMLElement | null>(null)
const howRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

const visibilityOptions = { threshold: 0.12 }

const landingInView = useElementVisibility(landingRef, visibilityOptions)
const whatInView = useElementVisibility(whatRef, visibilityOptions)
const whyInView = useElementVisibility(whyRef, visibilityOptions)
const howInView = useElementVisibility(howRef, visibilityOptions)
const ctaInView = useElementVisibility(ctaRef, visibilityOptions)

const landingShown = ref(false)
const whatShown = ref(false)
const whyShown = ref(false)
const howShown = ref(false)
const ctaShown = ref(false)

watch(landingInView, (visible) => {
    if (visible) landingShown.value = true
}, { immediate: true })

watch(whatInView, (visible) => {
    if (visible) whatShown.value = true
}, { immediate: true })

watch(whyInView, (visible) => {
    if (visible) whyShown.value = true
}, { immediate: true })

watch(howInView, (visible) => {
    if (visible) howShown.value = true
}, { immediate: true })

watch(ctaInView, (visible) => {
    if (visible) ctaShown.value = true
}, { immediate: true })
</script>

<template>
    <div class="home-page">
        <div class="home-content">
            <div ref="landingRef" class="reveal-section" :class="{ 'in-view': landingShown }">
                <HomeHeroSection :is-authenticated="Boolean(auth.token)" />
            </div>
            <div ref="whatRef" class="reveal-section" :class="{ 'in-view': whatShown }">
                <HomeWhatIsSection />
            </div>
            <div ref="whyRef" class="reveal-section" :class="{ 'in-view': whyShown }">
                <HomeWhySection />
            </div>
            <div ref="howRef" class="reveal-section" :class="{ 'in-view': howShown }">
                <HomeHowSection />
            </div>
            <div ref="ctaRef" class="reveal-section" :class="{ 'in-view': ctaShown }">
                <HomeCtaSection :is-authenticated="Boolean(auth.token)" />
            </div>
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

.reveal-section {
    opacity: 0;
    transform: translateY(34px) scale(0.985);
    transition: opacity 860ms cubic-bezier(0.2, 0.75, 0.2, 1), transform 860ms cubic-bezier(0.2, 0.75, 0.2, 1);
    transition-delay: 100ms;
    will-change: opacity, transform;
}

.reveal-section.in-view {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>
<script setup lang="ts">
defineProps<{
  isAuthenticated: boolean
}>()
</script>

<template>
  <section id="cta" class="cta-shell reveal-up">
    <h2 class="cta-title">Ready to start your first ELSA Journal?</h2>
    <p class="cta-desc">It takes a few minutes to set up. Your team will thank you at review time.</p>
    <UButton
      :to="isAuthenticated ? '/lifecycles' : '/auth/register'"
      color="neutral"
      size="lg"
      class="rounded-full bg-white text-[var(--ej-teal-dark)] hover:bg-white/90"
    >
      {{ isAuthenticated ? 'Open my lifecycles' : 'Get started' }}
      <UIcon name="i-lucide-arrow-right" class="size-4" />
    </UButton>
  </section>
</template>

<style scoped>
.cta-shell {
  background: var(--ej-teal);
  border-radius: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--ej-teal) 65%, black 35%);
  padding: clamp(2.2rem, 5vw, 4.2rem);
  text-align: center;
}

.cta-title {
  color: #fff;
  font-family: var(--ej-serif);
  font-size: clamp(1.9rem, 4vw, 2.6rem);
  line-height: 1.2;
}

.cta-desc {
  margin-top: 0.9rem;
  margin-bottom: 1.6rem;
  color: rgba(255, 255, 255, 0.82);
}

.reveal-up {
  animation: revealUp 650ms ease both;
}

@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

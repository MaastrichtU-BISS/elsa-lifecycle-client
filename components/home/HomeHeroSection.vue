<script setup lang="ts">
const props = defineProps<{
  isAuthenticated: boolean
  isLoading: boolean
  lastLifecycle?: {
    lifecycleId?: string
    lifecycleTitle?: string
    reflectionTitle?: string
  } | null
  lastLifecycleLink?: string | null
}>()

</script>

<template>
  <section id="landing" class="landing-grid">
    <div class="landing-left reveal-up">
      <p class="kicker">Ethical · Legal · Societal Aspects</p>
      <h1 class="hero-title">
        A reflection tool for <em>responsible</em> data science
      </h1>
      <p class="hero-desc">
        The ELSA Journal helps you embed ethical, legal, and societal thinking into every stage of your
        data science projects: structured, traceable, and practical.
      </p>
      <div class="hero-actions">
        <UButton to="/lifecycles" size="lg" class="rounded-full px-6">
          Start journaling
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </UButton>
        <UButton color="neutral" variant="outline" size="lg" class="rounded-full" to="#what-is">
          How it works
        </UButton>
      </div>
    </div>

    <div class="landing-right reveal-up">
      <p class="panel-label">Sign in or get started</p>

      <div v-if="props.isLoading" class="loading-shell">
        <UIcon name="i-lucide-loader-circle" class="size-9 animate-spin text-[var(--ej-teal-soft)]" />
      </div>

      <template v-else-if="props.isAuthenticated && props.lastLifecycle">
        <UCard class="action-card highlighted">
          <template #header>
            <p class="card-title">Continue your latest lifecycle</p>
          </template>
          <p class="card-desc">
            You were last working on
            <span class="font-medium text-white">{{ props.lastLifecycle.lifecycleTitle || 'your lifecycle' }}</span>.
          </p>
          <UButton
            v-if="props.lastLifecycleLink"
            :to="props.lastLifecycleLink"
            class="mt-4 w-full justify-center rounded-full"
            color="primary"
          >
            Continue where you left off
          </UButton>
          <UButton
            v-else
            to="/lifecycles"
            class="mt-4 w-full justify-center rounded-full"
            variant="outline"
            color="neutral"
          >
            Open lifecycles
          </UButton>
        </UCard>
      </template>

      <template v-else>
        <UCard class="action-card highlighted">
          <template #header>
            <p class="card-title">First time here?</p>
          </template>
          <p class="card-desc">
            Let us walk you through the ELSA Journal and set up your first project.
          </p>
          <UButton to="/auth/register" class="mt-4 w-full justify-center rounded-full" color="primary">
            Walk me through it
          </UButton>
        </UCard>

        <UCard class="action-card">
          <template #header>
            <p class="card-title">Been here before?</p>
          </template>
          <p class="card-desc">
            Log in to your workspace and pick up where you left off on your ongoing projects.
          </p>
          <UButton to="/auth/login" class="mt-4 w-full justify-center rounded-full" color="neutral" variant="outline">
            Log in
          </UButton>
        </UCard>
      </template>
    </div>
  </section>
</template>

<style scoped>
.landing-grid {
  min-height: calc(100vh - 5rem);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  border: 1px solid var(--ej-rule);
  border-radius: 1.25rem;
  overflow: hidden;
}

.landing-left {
  background: var(--ej-cream);
  padding: clamp(2rem, 5vw, 4.5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.landing-right {
  background: var(--ej-ink);
  background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 34px 34px;
  padding: clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.kicker {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ej-teal);
  margin-bottom: 1rem;
  font-weight: 600;
}

.hero-title {
  font-family: var(--ej-serif);
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--ej-ink);
}

.hero-title em {
  color: var(--ej-teal);
  font-style: italic;
}

.hero-desc {
  margin-top: 1.25rem;
  color: var(--ej-ink-mid);
  max-width: 44ch;
  line-height: 1.75;
}

.hero-actions {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.panel-label {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
}

.action-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.action-card :deep(.divide-y) {
  border-color: rgba(255, 255, 255, 0.08);
}

.highlighted {
  border-color: rgba(13, 122, 107, 0.5);
}

.card-title {
  color: #fff;
  font-family: var(--ej-serif);
  font-size: 1.25rem;
  line-height: 1.2;
}

.card-desc {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  font-size: 0.92rem;
}

.loading-shell {
  min-height: 12rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 1rem;
  display: grid;
  place-items: center;
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

@media (max-width: 960px) {
  .landing-grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}
</style>

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
  <section id="landing" class="grid min-h-[82svh] items-stretch gap-4 rounded-2xl border border-default bg-default p-4 md:grid-cols-2 md:p-8 lg:min-h-[88svh]">
    <div class="animate-[fade-up_0.5s_ease] flex flex-col justify-center">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Ethical · Legal · Societal Aspects</p>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
        A reflection tool for <span class="text-primary">responsible</span> data science
      </h1>
      <p class="mt-4 max-w-2xl text-base leading-7 text-toned">
        The ELSA Journal helps you embed ethical, legal, and societal thinking into every stage of your
        data science projects: structured, traceable, and practical.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <UButton to="/lifecycles" size="lg" class="rounded-full px-6">
          Start journaling
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </UButton>
        <UButton color="neutral" variant="outline" size="lg" class="rounded-full" to="#what-is">
          How it works
        </UButton>
      </div>
    </div>

    <div class="animate-[fade-up_0.6s_ease] flex flex-col justify-center space-y-3 rounded-xl bg-elevated/50 p-4 ring-1 ring-inset ring-accented bg-[linear-gradient(rgba(120,120,120,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.12)_1px,transparent_1px)] bg-[size:30px_30px]">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-toned">Sign in or get started</p>

      <div v-if="props.isLoading" class="grid min-h-52 place-items-center rounded-lg border border-default bg-default">
        <UIcon name="i-lucide-loader-circle" class="size-9 animate-spin text-primary" />
      </div>

      <template v-else-if="props.isAuthenticated && props.lastLifecycle">
        <UCard class="ring-1 ring-inset ring-primary/40">
          <template #header>
            <p class="text-lg font-semibold text-highlighted">Continue your latest lifecycle</p>
          </template>
          <p class="text-sm leading-7 text-toned">
            You were last working on
            <span class="font-medium text-highlighted">{{ props.lastLifecycle.lifecycleTitle || 'your lifecycle' }}</span>.
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
        <UCard class="ring-1 ring-inset ring-primary/40">
          <template #header>
            <p class="text-lg font-semibold text-highlighted">First time here?</p>
          </template>
          <p class="text-sm leading-7 text-toned">
            Let us walk you through the ELSA Journal and set up your first project.
          </p>
          <UButton to="/auth/register" class="mt-4 w-full justify-center rounded-full" color="primary">
            Walk me through it
          </UButton>
        </UCard>

        <UCard>
          <template #header>
            <p class="text-lg font-semibold text-highlighted">Been here before?</p>
          </template>
          <p class="text-sm leading-7 text-toned">
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
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

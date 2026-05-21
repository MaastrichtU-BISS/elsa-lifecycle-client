<template>
  <section id="how" class="scroll-mt-[8svh] lg:scroll-mt-[10svh] rounded-2xl border border-default bg-default p-4 md:p-8 min-h-[82svh] lg:min-h-[88svh] flex flex-col justify-center animate-[fade-up_0.65s_ease]">
    <div class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">How it works</p>
      <h2 class="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
        Non-linear, <span class="text-primary">flexible</span> reflection built into your workflow
      </h2>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
      <div>
        <article v-for="(step, index) in steps" :key="step.title" class="flex gap-4 border-b border-default py-5 first:pt-0 last:border-none last:pb-0">
          <p class="w-8 shrink-0 text-primary">{{ roman[index] }}</p>
          <div>
            <h3 class="font-semibold text-highlighted">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-toned">{{ step.description }}</p>
          </div>
        </article>
      </div>

      <div class="sticky top-24 self-start rounded-xl border border-default bg-elevated p-4 bg-[linear-gradient(rgba(120,120,120,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.12)_1px,transparent_1px)] bg-[size:26px_26px]">
        <div class="mb-2 flex items-center justify-between">
          <p class="font-semibold text-highlighted">Demand Forecasting v2</p>
          <UBadge color="primary" variant="soft" size="sm">Active</UBadge>
        </div>

        <UCard v-for="entry in notebookEntries" :key="entry.meta" class="mb-3 last:mb-0" :class="entry.active ? 'ring-1 ring-inset ring-primary/40' : ''">
          <p class="text-xs uppercase tracking-[0.1em] text-toned">{{ entry.meta }}</p>
          <p class="mt-2 text-sm leading-6 text-toned">{{ entry.text }}</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <UBadge
              v-for="tag in entry.tags"
              :key="tag"
              color="neutral"
              variant="outline"
              size="sm"
            >
              {{ tag }}
            </UBadge>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const roman = ['i.', 'ii.', 'iii.', 'iv.', 'v.']

const steps = [
  {
    title: 'Start wherever makes sense',
    description:
      'The journal is organised by project phases, but there is no required order. Begin with the phase most relevant now and revisit any phase as thinking evolves.'
  },
  {
    title: 'Reflect on each question at your own pace',
    description:
      'Each section poses focused prompts to guide your thinking. Move freely between questions and phases with no fixed path.'
  },
  {
    title: 'Save your answer or explore recommendations',
    description:
      'When ready, save and continue. Or request curated tools, checklists, and frameworks, then deepen your response before saving.'
  },
  {
    title: 'Come back and revise at any time',
    description:
      'Entries are never locked. Return as your project develops, new risks emerge, or decisions change.'
  },
  {
    title: 'Export when you need it',
    description:
      'Generate impact assessments, ethics summaries, or model cards from your entries. Your groundwork is already captured.'
  }
]

const notebookEntries = [
  {
    meta: 'Data collection · Privacy and consent · 14 May 2025',
    text: 'Decided to exclude postcode-level demographic data from the training set to reduce socioeconomic bias risks.',
    tags: ['Privacy', 'Fairness', 'Data'],
    active: true
  },
  {
    meta: 'Problem definition · Stakeholders · 2 May 2025',
    text: 'Completed stakeholder mapping and identified groups that need stronger consent communication.',
    tags: ['Stakeholders', 'Consent'],
    active: false
  },
  {
    meta: 'Documentation · Data audit · 9 May 2025',
    text: 'Data minimisation complete, purpose limitation complete, retention policy pending legal review.',
    tags: ['Legal'],
    active: false
  }
]
</script>

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

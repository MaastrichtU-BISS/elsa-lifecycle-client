<template>
  <section id="what-is" class="scroll-mt-[8svh] lg:scroll-mt-[10svh] rounded-2xl border border-default bg-default p-4 md:p-8 min-h-[82svh] lg:min-h-[88svh] flex flex-col justify-center animate-[fade-up_0.55s_ease]">
    <div class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">What is it?</p>
      <h2 class="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
        Your ethical reasoning, <span class="text-primary">documented</span>
      </h2>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <p class="leading-7 text-toned">
          The ELSA Journal is designed for data science projects, offering structured space to reflect on
          the harder questions that technical work often leaves unasked.
        </p>

        <ul class="mt-5 divide-y divide-default rounded-xl border border-default bg-elevated/30">
          <li class="px-4 py-3 text-sm leading-6 text-toned">Are we using data responsibly?</li>
          <li class="px-4 py-3 text-sm leading-6 text-toned">Have we considered the impact on individuals and communities?</li>
          <li class="px-4 py-3 text-sm leading-6 text-toned">What are the legal requirements or potential risks?</li>
          <li class="px-4 py-3 text-sm leading-6 text-toned">Who might be affected, and how are their interests being considered?</li>
        </ul>

        <blockquote class="my-6 rounded-r-lg border-l-4 border-primary bg-elevated px-4 py-3 text-base italic leading-7 text-highlighted">
          The ELSA journal is like version control for your ethical reasoning.
        </blockquote>

        <p class="leading-7 text-toned">
          It provides space for your own reflections alongside curated tools, checklists, and methods
          tailored to each stage of the data science workflow, adding structure and traceability to a
          process that is otherwise invisible.
        </p>
      </div>

      <div class="grid content-start gap-3">
        <UCard v-for="feature in features" :key="feature.title">
          <div class="flex items-center gap-3">
            <div class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <UIcon :name="feature.icon" class="size-5" />
            </div>
            <div>
              <h3 class="font-semibold text-highlighted">{{ feature.title }}</h3>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'Structured reflection prompts',
    icon: 'i-lucide-message-square-more'
  },
  {
    title: 'Checklists and curated tools',
    icon: 'i-lucide-square-check-big'
  },
  {
    title: 'Traceable decision history',
    icon: 'i-lucide-clock-3'
  },
  {
    title: 'Project-specific reporting',
    icon: 'i-lucide-chart-line'
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

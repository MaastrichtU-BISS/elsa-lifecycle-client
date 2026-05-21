<template>
  <section id="why" class="scroll-mt-[8svh] lg:scroll-mt-[10svh] rounded-2xl border border-default bg-elevated/40 p-4 md:p-8 min-h-[82svh] lg:min-h-[88svh] flex flex-col justify-center animate-[fade-up_0.6s_ease]">
    <div class="mb-7 max-w-3xl">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Why use it?</p>
      <h2 class="mt-2 text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
        Just as a lab notebook anchors experimental science, the ELSA Journal
        <span class="text-primary">anchors responsible data science</span>
      </h2>
      <p class="mt-4 leading-7 text-toned">
        Without documentation, ethical reasoning stays buried in memory and chat threads. The ELSA Journal
        makes it explicit, searchable, and shareable, turning good intentions into good practice.
      </p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <UCard v-for="(benefit, index) in benefits" :key="benefit.title">
        <p class="text-3xl font-semibold text-primary/70">{{ String(index + 1).padStart(2, '0') }}</p>
        <h3 class="mt-2 font-semibold text-highlighted">{{ benefit.title }}</h3>
        <p class="mt-2 text-sm leading-6 text-toned">{{ benefit.description }}</p>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
const benefits = [
  {
    title: 'Reproducibility',
    description: 'Trace the ethical and societal reasoning behind every major decision in the project.'
  },
  {
    title: 'Simplified compliance',
    description: 'Writing impact assessments and ethics summaries becomes easier at review time.'
  },
  {
    title: 'Iterative course-correction',
    description: 'Captured insights can feed into model and data revisions over time.'
  },
  {
    title: 'Transparency by default',
    description: 'Your rationale for fairness, privacy, and bias decisions is documented and visible.'
  },
  {
    title: 'Cross-team collaboration',
    description: 'Bridge technical and non-technical perspectives with a shared decision history.'
  },
  {
    title: 'Institutional learning',
    description: 'Build a living archive of lessons learned across projects and teams.'
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

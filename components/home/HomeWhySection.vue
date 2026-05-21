<template>
  <section id="why" class="section-shell reveal-up">
    <div class="intro">
      <p class="kicker">Why use it?</p>
      <h2 class="title">
        Just as a lab notebook anchors experimental science, the ELSA Journal
        <em>anchors responsible data science</em>
      </h2>
      <p class="desc">
        Without documentation, ethical reasoning stays buried in memory and chat threads. The ELSA Journal
        makes it explicit, searchable, and shareable, turning good intentions into good practice.
      </p>
    </div>

    <div class="benefits-grid">
      <UCard v-for="(benefit, index) in benefits" :key="benefit.title" class="benefit-card">
        <p class="number">{{ String(index + 1).padStart(2, '0') }}</p>
        <h3 class="benefit-title">{{ benefit.title }}</h3>
        <p class="benefit-desc">{{ benefit.description }}</p>
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
.section-shell {
  padding: clamp(2.5rem, 5vw, 5rem);
  border-radius: 1.25rem;
  border: 1px solid var(--ej-rule);
  background: var(--ej-cream);
}

.intro {
  max-width: 62ch;
  margin-bottom: 2rem;
}

.kicker {
  color: var(--ej-teal);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
}

.title {
  margin-top: 0.7rem;
  color: var(--ej-ink);
  font-family: var(--ej-serif);
  font-size: clamp(1.9rem, 4vw, 2.7rem);
  line-height: 1.2;
}

.title em {
  color: var(--ej-teal);
  font-style: italic;
}

.desc {
  margin-top: 1rem;
  color: var(--ej-ink-mid);
  line-height: 1.8;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: var(--ej-rule);
  border: 1px solid var(--ej-rule);
  border-radius: 1rem;
  overflow: hidden;
}

.benefit-card {
  border: none;
  border-radius: 0;
  background: var(--ej-cream);
}

.number {
  font-family: var(--ej-serif);
  color: transparent;
  -webkit-text-stroke: 1.2px var(--ej-teal);
  font-size: 2.8rem;
  line-height: 1;
}

.benefit-title {
  margin-top: 0.8rem;
  color: var(--ej-ink);
  font-weight: 600;
}

.benefit-desc {
  margin-top: 0.55rem;
  color: var(--ej-ink-mid);
  line-height: 1.7;
  font-size: 0.9rem;
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
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>

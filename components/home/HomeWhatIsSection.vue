<template>
  <section id="what-is" class="section-box">
    <div class="section-head reveal-up">
      <p class="section-kicker">What is it?</p>
      <h2 class="section-title">Your ethical reasoning, <em>documented</em></h2>
    </div>

    <div class="grid-layout">
      <div class="left-copy reveal-up">
        <p>
          The ELSA Journal is designed for data science projects, offering structured space to reflect on
          the harder questions that technical work often leaves unasked.
        </p>

        <ul class="question-list">
          <li>Are we using data responsibly?</li>
          <li>Have we considered the impact on individuals and communities?</li>
          <li>What are the legal requirements or potential risks?</li>
          <li>Who might be affected, and how are their interests being considered?</li>
        </ul>

        <blockquote class="callout">The ELSA journal is like version control for your ethical reasoning.</blockquote>

        <p>
          It provides space for your own reflections alongside curated tools, checklists, and methods
          tailored to each stage of the data science workflow, adding structure and traceability to a
          process that is otherwise invisible.
        </p>
      </div>

      <div class="right-features reveal-up">
        <UCard v-for="feature in features" :key="feature.title" class="feature-item">
          <div class="feature-content">
            <div class="feature-icon">
              <UIcon :name="feature.icon" class="size-5" />
            </div>
            <div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.description }}</p>
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
    description: 'Curated questions guide your team through ethical checkpoints at each project stage.',
    icon: 'i-lucide-message-square-more'
  },
  {
    title: 'Checklists and curated tools',
    description: 'Practical resources tailored to your project type, data sources, and deployment context.',
    icon: 'i-lucide-square-check-big'
  },
  {
    title: 'Traceable decision history',
    description: 'Every entry is timestamped and linked to the project stage, creating an auditable record.',
    icon: 'i-lucide-clock-3'
  },
  {
    title: 'Project-specific reporting',
    description: 'Export impact assessments and ethics summaries directly from your journal entries.',
    icon: 'i-lucide-chart-line'
  }
]
</script>

<style scoped>
.section-box {
  padding: clamp(2.5rem, 5vw, 5rem);
  border: 1px solid var(--ej-rule);
  border-radius: 1.25rem;
  background: #fff;
}

.section-head {
  margin-bottom: 2.2rem;
}

.section-kicker {
  color: var(--ej-teal);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  margin-bottom: 0.8rem;
}

.section-title {
  font-family: var(--ej-serif);
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ej-ink);
  max-width: 23ch;
}

.section-title em {
  color: var(--ej-teal);
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: clamp(1.3rem, 3vw, 4rem);
}

.left-copy p {
  color: var(--ej-ink-mid);
  line-height: 1.8;
}

.question-list {
  margin-top: 1.2rem;
  margin-bottom: 1.6rem;
  border: 1px solid var(--ej-rule);
  border-radius: 0.75rem;
  list-style: none;
}

.question-list li {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--ej-rule);
  color: var(--ej-ink-mid);
}

.question-list li:last-child {
  border-bottom: none;
}

.callout {
  margin: 0 0 1.5rem;
  background: var(--ej-cream);
  border-left: 3px solid var(--ej-teal);
  border-radius: 0 0.6rem 0.6rem 0;
  padding: 1rem 1.2rem;
  color: var(--ej-ink);
  font-family: var(--ej-serif);
  font-size: 1.2rem;
  line-height: 1.45;
  font-style: italic;
}

.right-features {
  display: grid;
  gap: 0.8rem;
  align-content: start;
}

.feature-item {
  border: 1px solid var(--ej-rule);
}

.feature-content {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
}

.feature-icon {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.6rem;
  background: var(--ej-teal-light);
  color: var(--ej-teal);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.feature-title {
  color: var(--ej-ink);
  font-weight: 600;
}

.feature-desc {
  color: var(--ej-ink-light);
  margin-top: 0.25rem;
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
  .grid-layout {
    grid-template-columns: 1fr;
  }
}
</style>

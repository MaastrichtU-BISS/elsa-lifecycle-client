<template>
  <section id="how" class="section-shell reveal-up">
    <div class="head">
      <p class="kicker">How it works</p>
      <h2 class="title">Non-linear, <em>flexible</em> reflection built into your workflow</h2>
    </div>

    <div class="layout-grid">
      <div class="steps">
        <article v-for="(step, index) in steps" :key="step.title" class="step-item">
          <p class="step-number">{{ roman[index] }}</p>
          <div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.description }}</p>
          </div>
        </article>
      </div>

      <div class="notebook-wrap">
        <div class="notebook-head">
          <p class="notebook-title">Demand Forecasting v2</p>
          <UBadge color="primary" variant="soft" size="sm">Active</UBadge>
        </div>

        <UCard v-for="entry in notebookEntries" :key="entry.meta" class="notebook-entry" :class="{ active: entry.active }">
          <p class="entry-meta">{{ entry.meta }}</p>
          <p class="entry-text">{{ entry.text }}</p>
          <div class="tag-list">
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
.section-shell {
  padding: clamp(2.5rem, 5vw, 5rem);
  border-radius: 1.25rem;
  border: 1px solid var(--ej-rule);
  background: #fff;
}

.head {
  margin-bottom: 2.4rem;
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
  max-width: 22ch;
}

.title em {
  color: var(--ej-teal);
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 0.95fr;
  gap: clamp(1.2rem, 3vw, 4rem);
}

.step-item {
  display: flex;
  gap: 1rem;
  padding: 1.4rem 0;
  border-bottom: 1px solid var(--ej-rule);
}

.step-item:first-child {
  padding-top: 0;
}

.step-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.step-number {
  color: var(--ej-teal);
  font-family: var(--ej-serif);
  width: 2rem;
  flex-shrink: 0;
}

.step-title {
  color: var(--ej-ink);
  font-weight: 600;
}

.step-desc {
  margin-top: 0.4rem;
  color: var(--ej-ink-mid);
  line-height: 1.7;
  font-size: 0.92rem;
}

.notebook-wrap {
  position: sticky;
  top: 5.5rem;
  align-self: start;
  background: var(--ej-ink);
  border-radius: 1rem;
  padding: 1.2rem;
  display: grid;
  gap: 0.7rem;
  background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 26px 26px;
}

.notebook-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}

.notebook-title {
  color: #fff;
  font-family: var(--ej-serif);
}

.notebook-entry {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.notebook-entry.active {
  border-color: rgba(94, 201, 185, 0.9);
}

.entry-meta {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.entry-text {
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.88rem;
  line-height: 1.65;
  margin-top: 0.45rem;
}

.tag-list {
  margin-top: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
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
  .layout-grid {
    grid-template-columns: 1fr;
  }

  .notebook-wrap {
    position: static;
  }
}
</style>

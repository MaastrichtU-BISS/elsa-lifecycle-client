<script setup lang="ts">
defineProps<{
  isAuthenticated: boolean
}>()
</script>

<template>
  <section id="cta" class="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center min-h-[28svh] lg:min-h-[34svh] flex flex-col justify-center bg-[linear-gradient(rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.1)_1px,transparent_1px)] bg-[size:30px_30px] animate-[fade-up_0.7s_ease] sm:p-10">
    <h2 class="text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">Ready to start your first ELSA Journal?</h2>
    <p class="mx-auto mt-3 max-w-2xl text-sm leading-7 text-toned">It takes a few minutes to set up. Your team will thank you at review time.</p>
    <UButton
      :to="isAuthenticated ? '/lifecycles' : '/auth/register'"
      color="primary"
      size="lg"
      class="mt-5 self-center rounded-full"
    >
      {{ isAuthenticated ? 'See our lifecycles' : 'Get started' }}
      <UIcon name="i-lucide-arrow-right" class="size-4" />
    </UButton>
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

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Life Cycles',
    icon: 'i-lucide-recycle',
    to: '/lifecycles',
  },
  {
    label: 'Tools',
    icon: 'i-lucide-wrench',
    to: '/tools'
  },
])
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
    <UNavigationMenu :items="items" class="w-full justify-center" />
    <slot />
  </main>
</template>
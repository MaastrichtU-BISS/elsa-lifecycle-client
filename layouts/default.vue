<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/',
  },
  {
    label: 'Questionnaires',
    icon: 'i-lucide-clipboard-pen-line',
    to: '/questionnaires',
  },
  {
    label: 'Tools',
    icon: 'i-lucide-wrench',
    to: '/tools'
  },
])
</script>

<template>
  <UNavigationMenu :items="items" class="w-full justify-center" />
  <slot />
</template>
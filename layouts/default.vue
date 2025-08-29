<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const auth = useAuthStore();

const userEmail = computed(() => {
  return auth.user?.email || null;
});

const fixedItems = [
  [{
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/',
  }],
  [
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
  ]];

const items = computed((): NavigationMenuItem[][] => {
  if (userEmail.value) {
    return [...fixedItems, [{
      label: userEmail.value,
      icon: 'i-lucide-user',
      children: [
        {
          label: 'Logout',
          icon: 'i-lucide-log-out',
          onSelect: () => {
            auth.logout();
          },
        }
      ],
    }]];
  }
  return [...fixedItems, [{
    label: 'Login',
    icon: 'i-lucide-log-in',
    to: '/auth/login',
  }]];
});

onMounted(async () => {
  await auth.init();
});

</script>

<template>
  <UNavigationMenu :items="items" class="w-full px-2" arrow content-orientation="vertical" />
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
    <slot />
  </main>
</template>
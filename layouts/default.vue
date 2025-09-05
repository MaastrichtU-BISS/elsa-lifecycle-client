<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const auth = useAuthStore();

const userEmail = computed(() => {
  return auth.user?.email || null;
});

const colorMode = useColorMode();
const colorModeReady = computed(() => ['dark', 'light'].includes(colorMode.value));

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

const fixedItems = computed(() => [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
    }
  ],
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
  ]]);

const items = computed((): NavigationMenuItem[][] => {
  const lightDarkButton = {
    icon: colorModeReady.value ? (isDark.value ? 'i-lucide-moon' : 'i-lucide-sun') : '',
    onSelect: () => isDark.value = !isDark.value,
  };
  
  if (userEmail.value) {
    return [...fixedItems.value, [lightDarkButton, {
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
  return [...fixedItems.value, [lightDarkButton, {
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
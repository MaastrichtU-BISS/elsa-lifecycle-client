<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const userEmail = computed(() => {
  return auth.user?.email || null;
});

const colorMode = useColorMode();

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
      to: '/tools',
    },
  ]]);

const items = computed((): NavigationMenuItem[][] => {
  const lightDarkButton = {
    icon: isDark.value ? 'i-lucide-moon' : 'i-lucide-sun',
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
    onSelect: () => {
      // Build redirect URL with current path and hash
      const currentPath = route.path;
      const currentHash = route.hash;
      const redirectUrl = currentPath + currentHash;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
    },
  }]];
});

onMounted(async () => {
  await auth.init();
});

</script>

<template>
  <div>
    <ClientOnly>
      <UNavigationMenu :items="items"
        class="w-full px-2 grid grid-cols-3 [&>*:nth-child(2)]:justify-self-center [&>*:nth-child(3)]:justify-self-end"
        arrow content-orientation="vertical" />
    </ClientOnly>
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <slot />
    </main>
  </div>
</template>
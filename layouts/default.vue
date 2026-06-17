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

const fixedItems = computed(() => {
  const navGroups: NavigationMenuItem[][] = [
    [
      {
        label: 'Home',
        icon: 'i-lucide-house',
        to: '/',
      },
      {
        label: 'My Journals',
        icon: 'i-lucide-notebook-pen',
        to: '/journals',
      },
      {
        label: 'Tools',
        icon: 'i-lucide-wrench',
        to: '/tools',
      }
    ]
  ];

  return navGroups;
});

const navMenuClass = computed(() => {
  if (route.path === '/') {
    return 'w-full mx-auto px-2 sm:px-3 lg:px-4 py-2'
  }
  return 'w-full mx-auto px-2 sm:px-3 lg:px-4 py-2'
})

const mainClass = computed(() => {
  if (route.path === '/') {
    return 'w-full mx-auto px-2 sm:px-3 lg:px-4 py-2'
  }

  if (route.path.startsWith('/lifecycles/')) {
    return 'w-full mx-auto max-w-none px-2 sm:px-3 lg:px-4 py-2'
  }

  return 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2'
})

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
    <header
      class="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
      <ClientOnly>
        <UNavigationMenu :items="items" :class="navMenuClass" arrow content-orientation="vertical" />
      </ClientOnly>
    </header>
    <main :class="mainClass">
      <slot />
    </main>
  </div>
</template>
import { useLifecycleStore } from '~/stores/lifecycle'

export default defineNuxtPlugin(() => {
  const store = useLifecycleStore()
  if (import.meta.client) {
    store.hydrateFromLocalStorage()
  }
})
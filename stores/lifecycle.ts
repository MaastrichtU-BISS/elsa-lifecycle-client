
import { defineStore } from 'pinia'
import type { ReflectionLastLifecycle, RecommendationLastLifecycle } from '~/utils/types'

type LifecycleStoreLastLifecycle = RecommendationLastLifecycle | ReflectionLastLifecycle

export const useLifecycleStore = defineStore('lifecycle', {
  state: () => ({
    lastLifecycle: null as LifecycleStoreLastLifecycle | null,
  }),
  actions: {
    setLastLifecycle(data: LifecycleStoreLastLifecycle | null) {
      this.lastLifecycle = data ? JSON.parse(JSON.stringify(data)) as LifecycleStoreLastLifecycle : null
    },
    clearLastLifecycle() {
      this.lastLifecycle = null
    },
  }
})
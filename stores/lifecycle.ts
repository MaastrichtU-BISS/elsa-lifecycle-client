
import { defineStore } from 'pinia'
import type { LastLifecycle } from '~/utils/types'

export const useLifecycleStore = defineStore('lifecycle', {
  state: () => ({
    lastLifecycle: null as LastLifecycle | null,
  }),
  actions: {
    setLastLifecycle(data: LastLifecycle | null) {
      this.lastLifecycle = data ? JSON.parse(JSON.stringify(data)) as LastLifecycle : null
    },
    clearLastLifecycle() {
      this.lastLifecycle = null
    },
  }
})

import { defineStore } from 'pinia'
import type { LastLifecycle } from '~/utils/types'

export const useLifecycleStore = defineStore('lifecycle', {
  state: () => ({
    lastLifecycle: null as LastLifecycle | null,
    lastLifecycleTimestamp: null as number | null
  }),
  actions: {
    setLastLifecycle(data: LastLifecycle | null) {
      const plain = data ? JSON.parse(JSON.stringify(data)) as LastLifecycle : null
      this.lastLifecycle = plain
      this.lastLifecycleTimestamp = Date.now()
      localStorage.setItem('lastLifecycle', JSON.stringify(plain))
      localStorage.setItem('lastLifecycleTimestamp', this.lastLifecycleTimestamp.toString())
    },
    clearLastLifecycle() {
      this.lastLifecycle = null
      this.lastLifecycleTimestamp = null
      localStorage.removeItem('lastLifecycle')
      localStorage.removeItem('lastLifecycleTimestamp')
    },
    hydrateFromLocalStorage() {
      if (import.meta.client) {
        let raw = localStorage.getItem('lastLifecycle')
        let ts = localStorage.getItem('lastLifecycleTimestamp')
        try {
          this.lastLifecycle = raw ? JSON.parse(raw) : null
        } catch {
          this.lastLifecycle = null
          localStorage.removeItem('lastLifecycle')
        }
        this.lastLifecycleTimestamp = ts ? parseInt(ts) : null
      }
    },
    isLastLifecycleFresh(maxAgeMs: number) {
      if (!this.lastLifecycleTimestamp) return false
      return Date.now() - this.lastLifecycleTimestamp < maxAgeMs
    }
  }
})
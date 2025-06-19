import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: null as any,
  }),

  actions: {
    async login(email: string, password: string) {
      const res = await $fetch<{ token: string }>(
        `${useRuntimeConfig().public.apiBase}/auth/login`,
        {
          method: "POST",
          body: { email, password },
        }
      );

      this.token = res.token;
      localStorage.setItem("token", res.token);
    },

    async register(email: string, password: string, confirmPassword: string) {
      const res = await $fetch<{ token: string }>(
        `${useRuntimeConfig().public.apiBase}/auth/register`,
        {
          method: "POST",
          body: { email, password, confirmPassword },
        }
      );

      this.token = res.token;
      localStorage.setItem("token", res.token);
    },

    async getUser() {
      if (!this.token) return;

      const user = await $fetch(`${useRuntimeConfig().public.apiBase}/user`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      this.user = user;
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },

    async init() {
      // Check if a token is saved in localStorage
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        this.token = savedToken;
        await this.getUser();
      }
    },
  },
});

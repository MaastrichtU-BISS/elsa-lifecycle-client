import type { Reflection } from "~/utils/types";

export class ReflectionService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async getReflectionById(id: number): Promise<Reflection> {
    try {
      const response = await $fetch(`${this.url}/reflections/${id}`, {
        method: "GET",
      });
      return response as Reflection;
    } catch (error) {
      throw new Error(`Failed to fetch reflection: ${error}`);
    }
  }
}

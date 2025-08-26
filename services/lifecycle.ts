import type { Lifecycle, Phase } from "~/utils/types";

export class LifecycleService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async getAllLifecycles(): Promise<Lifecycle[]> {
    try {
      const response = await $fetch(`${this.url}/lifecycles`, {
        method: "GET",
      });
      return response as Lifecycle[];
    } catch (error) {
      throw new Error(`Failed to fetch reflection: ${error}`);
    }
  }

  async getLifecycleById(id: number): Promise<Lifecycle> {
    try {
      const response = await $fetch(`${this.url}/lifecycles/${id}`, {
        method: "GET",
      });
      return response as Lifecycle;
    } catch (error) {
      throw new Error(`Failed to fetch lifecycle: ${error}`);
    }
  }

  async getPhases(id: number): Promise<Phase[]> {
    try {
      const response = await $fetch(`${this.url}/lifecycles/${id}/phases`, {
        method: "GET",
      });
      return response as Phase[];
    } catch (error) {
      throw new Error(`Failed to fetch phases: ${error}`);
    }
  }
}

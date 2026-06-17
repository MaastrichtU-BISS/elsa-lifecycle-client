import { BaseService } from "./base";
import type { Lifecycle } from "~/utils/types";

export class LifecycleService extends BaseService {
  async getAllLifecycles(): Promise<Lifecycle[]> {
    try {
      const response = await $fetch(`${this.url}/lifecycles`, {
        method: "GET",
      });
      return response as Lifecycle[];
    } catch (error) {
      throw new Error(`Failed to fetch lifecycle: ${error}`);
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
}

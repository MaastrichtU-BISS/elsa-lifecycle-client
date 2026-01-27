import { BaseService } from "./base";
import type { Reflection } from "~/utils/types";

export class ReflectionService extends BaseService {
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

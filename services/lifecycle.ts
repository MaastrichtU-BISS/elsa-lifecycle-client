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

  async generatePDFById(id: number): Promise<Blob> {
    try {
      const response = await $fetch(`${this.url}/lifecycles/${id}/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        responseType: 'blob',
      });

      return response as Blob;
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error}`);
    }
  }
}

import { BaseService } from "./base";
import type { Lifecycle } from "~/utils/types";
import type { ReflectionLastLifecycle, RecommendationLastLifecycle } from "~/utils/types";

type LastLifecycle = RecommendationLastLifecycle | ReflectionLastLifecycle;
  
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
        responseType: "blob",
      });

      return response as Blob;
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error}`);
    }
  }

  async generatePDFByIdForReflection(
    id: number,
    reflectionId: number,
  ): Promise<Blob> {
    try {
      const response = await $fetch(
        `${this.url}/lifecycles/${id}/pdf?reflectionId=${reflectionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          responseType: "blob",
        },
      );

      return response as Blob;
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error}`);
    }
  }

  async getLatestLifecycleForUser(): Promise<LastLifecycle | null> {
    try {
      const response = await $fetch(`${this.url}/progress/last-updated`, {
        method: "GET",
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const payload = response as LastLifecycle | { data?: LastLifecycle };
      return ("data" in payload && payload.data ? payload.data : payload) as LastLifecycle;
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) return null;
      throw new Error(`Failed to fetch latest lifecycle: ${error}`);
    }
  }
}

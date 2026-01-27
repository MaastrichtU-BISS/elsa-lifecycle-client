import { BaseService } from "./base";
import type { Phase } from "~/utils/types";

export class PhaseService extends BaseService {
  async getPhaseById(id: number): Promise<Phase> {
    try {
      const response = await $fetch(`${this.url}/phases/${id}`, {
        method: "GET",
      });
      return response as Phase;
    } catch (error) {
      throw new Error(`Failed to fetch phase: ${error}`);
    }
  }
}

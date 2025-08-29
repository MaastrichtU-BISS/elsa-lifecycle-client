import type { Phase } from "~/utils/types";

export class PhaseService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

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

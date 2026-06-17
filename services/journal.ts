import { BaseService } from "./base";
import type { Journal } from "~/utils/types";

export class JournalService extends BaseService {
  async getAllJournalsByUserId(userId: number): Promise<Journal[]> {
    try {
      const response = await $fetch(`${this.url}/journals?userId=${userId}`, {
        method: "GET",
      });
      return response as Journal[];
    } catch (error) {
      throw new Error(`Failed to fetch journals: ${error}`);
    }
  }

  async getJournalById(id: number): Promise<Journal> {
    try {
      const response = await $fetch(`${this.url}/journals/${id}`, {
        method: "GET",
      });

      return response as Journal;
    } catch (error) {
      throw new Error(`Failed to fetch journal: ${error}`);
    }
  }

  async createJournal(journal: Omit<Journal, "id" | "userId">): Promise<Journal> {
    try {
      const response = await $fetch(`${this.url}/journals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(journal),
      });
      return response as Journal;
    } catch (error) {
      throw new Error(`Failed to create journal: ${error}`);
    }
  }

  async generatePDFById(id: number): Promise<Blob> {
    try {
      const response = await $fetch(`${this.url}/journals/${id}/pdf`, {
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
        `${this.url}/journals/${id}/pdf?reflectionId=${reflectionId}`,
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
}

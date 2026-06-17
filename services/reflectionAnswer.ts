import { BaseService } from "./base";
import type { ReflectionAnswer } from "~/utils/types";

export class ReflectionAnswerService extends BaseService {

  // Protected
  async GetReflectionAnswerByJournalIdAndReflectionID(
    journalId: number,
    reflectionId: number
  ): Promise<ReflectionAnswer | undefined> {
    try {
      const response = await $fetch(`${this.url}/reflectionAnswers?rid=${reflectionId}&jid=${journalId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response ? (response as ReflectionAnswer) : undefined;
    } catch (error) {
      throw new Error(`Failed to fetch reflection answers: ${error}`);
    }
  }

  // protected
  async createReflectionAnswer(
    answer: Omit<ReflectionAnswer, "id">
  ): Promise<ReflectionAnswer> {
    try {
      const response = await $fetch(`${this.url}/reflectionAnswers`, {
        method: "POST",
        body: JSON.stringify(answer),
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response as ReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to create reflection answer: ${error}`);
    }
  }

  // protected
  async editReflectionAnswer(
    answer: Partial<ReflectionAnswer>,
    reflectionAnswerId: number
  ): Promise<ReflectionAnswer> {
    try {
      const response = await $fetch(`${this.url}/reflectionAnswers/${reflectionAnswerId}/edit`, {
        method: "PUT",
        body: JSON.stringify(answer),
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response as ReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to create reflection answer: ${error}`);
    }
  }
}

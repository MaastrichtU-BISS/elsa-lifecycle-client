import { BaseService } from "./base";
import type { FurtherReflectionAnswer } from "~/utils/types";

export class FurtherReflectionAnswerService extends BaseService {
  // Protected
  async GetFurtherReflectionAnswerByJournalIdAndReflectionID(
    journalId: number,
    reflectionId: number
  ): Promise<FurtherReflectionAnswer | undefined> {
    try {
      const response = await $fetch(
        `${this.url}/furtherReflectionAnswers?rid=${reflectionId}&jid=${journalId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response ? (response as FurtherReflectionAnswer) : undefined;
    } catch (error) {
      throw new Error(`Failed to fetch further reflection answers: ${error}`);
    }
  }

  // Protected
  async createFurtherReflectionAnswer(
    answer: Omit<FurtherReflectionAnswer, "id">
  ): Promise<FurtherReflectionAnswer> {
    try {
      const response = await $fetch(`${this.url}/furtherReflectionAnswers`, {
        method: "POST",
        body: JSON.stringify(answer),
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response as FurtherReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to create further reflection answer: ${error}`);
    }
  }

  // Protected
  async editFurtherReflectionAnswer(
    answer: Partial<FurtherReflectionAnswer>,
    furtherReflectionAnswerId: number
  ): Promise<FurtherReflectionAnswer> {
    try {
      const response = await $fetch(
        `${this.url}/furtherReflectionAnswers/${furtherReflectionAnswerId}/edit`,
        {
          method: "PUT",
          body: JSON.stringify(answer),
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response as FurtherReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to edit further reflection answer: ${error}`);
    }
  }
}

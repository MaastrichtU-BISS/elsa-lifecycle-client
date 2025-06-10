import type { JournalAnswer } from "~/utils/types";

export class JournalAnswerService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async createJournalAnswer(
    answer: Omit<JournalAnswer, "id">
  ): Promise<JournalAnswer> {
    try {
      const response = await $fetch(`${this.url}/journalAnswers`, {
        method: "POST",
        body: JSON.stringify(answer),
      });

      return response as JournalAnswer;
    } catch (error) {
      throw new Error(`Failed to create journal answer: ${error}`);
    }
  }
  

  async editJournalAnswer(
    answer: Partial<JournalAnswer>,
    journalAnswerId: number
  ): Promise<JournalAnswer> {
    try {
      const response = await $fetch(`${this.url}/journalAnswers/${journalAnswerId}/edit`, {
        method: "PUT",
        body: JSON.stringify(answer),
      });

      return response as JournalAnswer;
    } catch (error) {
      throw new Error(`Failed to create journal answer: ${error}`);
    }
  }
}

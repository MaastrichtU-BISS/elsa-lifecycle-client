import type { JournalAnswer } from "~/utils/types";

export class JournalAnswerService {
  private token: string;
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
    this.token = "";
  }

  setToken(token: string) {
    this.token = token;
  }

  // protected
  async GetJournalAnswerByUserIdAndJournalID(
    journalId: number
  ): Promise<JournalAnswer | undefined> {
    try {
      const response = await $fetch(
        `${this.url}/journalAnswers?jid=${journalId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response ? (response as JournalAnswer) : undefined;
    } catch (error) {
      throw new Error(`Failed to fetch journal answers: ${error}`);
    }
  }

  // protected
  async createJournalAnswer(
    answer: Omit<JournalAnswer, "id" | "userId">
  ): Promise<JournalAnswer> {
    try {
      const response = await $fetch(`${this.url}/journalAnswers`, {
        method: "POST",
        body: JSON.stringify(answer),
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response as JournalAnswer;
    } catch (error) {
      throw new Error(`Failed to create journal answer: ${error}`);
    }
  }

  // protected
  async editJournalAnswer(
    answer: Partial<JournalAnswer>,
    journalAnswerId: number
  ): Promise<JournalAnswer> {
    try {
      const response = await $fetch(
        `${this.url}/journalAnswers/${journalAnswerId}/edit`,
        {
          method: "PUT",
          body: JSON.stringify(answer),
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response as JournalAnswer;
    } catch (error) {
      throw new Error(`Failed to create journal answer: ${error}`);
    }
  }
}

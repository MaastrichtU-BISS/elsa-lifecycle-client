import type { Answer } from "~/utils/types";

export class AnswerService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async getAllAnswers(questionnaireId: number): Promise<Answer[]> {
    try {
      const response = await $fetch(`${this.url}/questionnaires/${questionnaireId}/answers`, {
        method: "GET",
      });
      return response as Answer[];
    } catch (error) {
      throw new Error(`Failed to fetch answers with questionnaireId ${questionnaireId}: ${error}`);
    }
  }

  async getAnswerById(id: number): Promise<Answer> {
    try {
      const response = await $fetch(`${this.url}/answers/${id}`, {
        method: "GET",
      });
      return response as Answer;
    } catch (error) {
      throw new Error(`Failed to fetch answer with id ${id}: ${error}`);
    }
  }

  async createAnswer(
    answer: Omit<Answer, "id">,
    questionnaireId: number
  ): Promise<Answer> {
    try {
      const response = await $fetch(`${this.url}/questionnaires/${questionnaireId}/answers`, {
        method: "POST",
        body: JSON.stringify(answer),
      });

      return response as Answer;
    } catch (error) {
      throw new Error(`Failed to create questionnaire: ${error}`);
    }
  }
}

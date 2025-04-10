import type { Questionnaire } from "~/utils/types";

export class QuestionnaireService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async getAllQuestionnaires(): Promise<Questionnaire[]> {
    try {
      const response = await $fetch(`${this.url}/questionnaires`, {
        method: "GET",
      });
      return response as Questionnaire[];
    } catch (error) {
      throw new Error(`Failed to fetch questionnaires: ${error}`);
    }
  }

  async getQuestionnaireById(id: number): Promise<Questionnaire> {
    try {
      const response = await $fetch(`${this.url}/questionnaires/${id}`, {
        method: "GET",
      });
      return response as Questionnaire;
    } catch (error) {
      throw new Error(`Failed to fetch questionnaire with id ${id}: ${error}`);
    }
  }

  async createQuestionnaire(
    questionnaire: Omit<Questionnaire, "id">
  ): Promise<Questionnaire> {
    try {
      const response = await $fetch(`${this.url}/questionnaires`, {
        method: "POST",
        body: JSON.stringify(questionnaire),
      });

      return response as Questionnaire;
    } catch (error) {
      throw new Error(`Failed to create questionnaire: ${error}`);
    }
  }
}

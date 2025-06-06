import type { RecommendationAnswer } from "~/utils/types";

export class RecommendationAnswerService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async createRecommendationAnswer(
    answer: Omit<RecommendationAnswer, "id">
  ): Promise<RecommendationAnswer> {
    try {
      const response = await $fetch(`${this.url}/recommendationAnswer`, {
        method: "POST",
        body: JSON.stringify(answer),
      });

      return response as RecommendationAnswer;
    } catch (error) {
      throw new Error(`Failed to create recommendation answer: ${error}`);
    }
  }

  async editRecommendationAnswer(
    answer: Partial<RecommendationAnswer>,
    recommendationAnswerId: number
  ): Promise<RecommendationAnswer> {
    try {
      const response = await $fetch(
        `${this.url}/recommendationAnswers/${recommendationAnswerId}/edit`,
        {
          method: "PUT",
          body: JSON.stringify(answer),
        }
      );

      return response as RecommendationAnswer;
    } catch (error) {
      throw new Error(`Failed to create recommendation answer: ${error}`);
    }
  }
}

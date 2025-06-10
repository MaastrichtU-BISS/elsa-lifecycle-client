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
    answer: FormData
  ): Promise<RecommendationAnswer> {
    try {
      const response = await $fetch(`${this.url}/recommendationAnswers`, {
        method: "POST",
        body: answer,
      });

      return response as RecommendationAnswer;
    } catch (error) {
      throw new Error(`Failed to create recommendation answer: ${error}`);
    }
  }

  async editRecommendationAnswer(
    answer: FormData,
    recommendationAnswerId: number
  ): Promise<RecommendationAnswer> {
    try {
      const response = await $fetch(
        `${this.url}/recommendationAnswers/${recommendationAnswerId}/edit`,
        {
          method: "PUT",
          body: answer,
        }
      );

      return response as RecommendationAnswer;
    } catch (error) {
      throw new Error(`Failed to edit recommendation answer: ${error}`);
    }
  }
}

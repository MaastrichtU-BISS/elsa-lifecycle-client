import type { RecommendationAnswer } from "~/utils/types";

export class RecommendationAnswerService {
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
  async GetRecommendationAnswerByUserIdAndRecommendationID(
    recommendationId: number
  ): Promise<ReflectionAnswer> {
    try {
      const response = await $fetch(
        `${this.url}/recommendationAnswers?rid=${recommendationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response as ReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to fetch reflection answers: ${error}`);
    }
  }

  // protected
  async createRecommendationAnswer(
    answer: FormData
  ): Promise<RecommendationAnswer> {
    try {
      const response = await $fetch(`${this.url}/recommendationAnswers`, {
        method: "POST",
        body: answer,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response as RecommendationAnswer;
    } catch (error) {
      throw new Error(`Failed to create recommendation answer: ${error}`);
    }
  }

  // protected
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
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response as RecommendationAnswer;
    } catch (error) {
      throw new Error(`Failed to edit recommendation answer: ${error}`);
    }
  }
}

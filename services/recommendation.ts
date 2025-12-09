import type {  Recommendation,  ReflectionAnswer } from "~/utils/types";
import { isGetRecommendationsActive } from "~/utils/helpers";

export class RecommendationService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async getRecommendations(
    reflectionId: number,
    reflectionAnswer: ReflectionAnswer
  ): Promise<Recommendation[]> {
    try {
      
      const getRecommendations = isGetRecommendationsActive(reflectionAnswer.form);

      if(getRecommendations) {
        const response = await $fetch(
          `${this.url}/recommendations/${reflectionId}?getRecommendations=${getRecommendations}`,
          {
            method: "GET",
          }
        );
        return response as Recommendation[];
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`Failed to fetch recommendations: ${error}`);
    }
  }
}

import type { Recommendation } from "~/utils/types";

export class RecommendationService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async getRecommendations(
    questionnaireId: number,
    binaryEvaluation: number
  ): Promise<Recommendation[]> {
    try {
      const response = await $fetch(
        `${this.url}/recommendations/${questionnaireId}?binaryEvaluation=${binaryEvaluation}`,
        {
          method: "GET",
        }
      );
      return response as Recommendation[];
    } catch (error) {
      throw new Error(`Failed to fetch recommendations: ${error}`);
    }
  }
}

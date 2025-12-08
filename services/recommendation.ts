import { ReflectionAnswerGetRecommendations, type Recommendation, type ReflectionAnswer } from "~/utils/types";

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

      const json = JSON.parse(reflectionAnswer.form)
      const getRecommendations = json['get_recommendations'] == ReflectionAnswerGetRecommendations.YES;

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

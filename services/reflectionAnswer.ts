import type { ReflectionAnswer } from "~/utils/types";

export class ReflectionAnswerService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async createReflectionAnswer(
    answer: Omit<ReflectionAnswer, "id">
  ): Promise<ReflectionAnswer> {
    try {
      const response = await $fetch(`${this.url}/reflectionAnswers`, {
        method: "POST",
        body: JSON.stringify(answer),
      });

      return response as ReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to create reflection answer: ${error}`);
    }
  }

  async editReflectionAnswer(
    answer: Partial<ReflectionAnswer>,
    reflectionAnswerId: number
  ): Promise<ReflectionAnswer> {
    try {
      const response = await $fetch(`${this.url}/reflectionAnswers/${reflectionAnswerId}/edit`, {
        method: "PUT",
        body: JSON.stringify(answer),
      });

      return response as ReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to create reflection answer: ${error}`);
    }
  }
}

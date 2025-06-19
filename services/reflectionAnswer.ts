import type { ReflectionAnswer } from "~/utils/types";

export class ReflectionAnswerService {
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

  // Protected
  async GetReflectionAnswerByUserIdAndReflectionID(
    reflectionId: number
  ): Promise<ReflectionAnswer> {
    try {
      const response = await $fetch(`${this.url}/reflectionAnswers?rid=${reflectionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response as ReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to fetch reflection answers: ${error}`);
    }
  }

  // protected
  async createReflectionAnswer(
    answer: Omit<ReflectionAnswer, "id" | "userId">
  ): Promise<ReflectionAnswer> {
    try {
      const response = await $fetch(`${this.url}/reflectionAnswers`, {
        method: "POST",
        body: JSON.stringify(answer),
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response as ReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to create reflection answer: ${error}`);
    }
  }

  // protected
  async editReflectionAnswer(
    answer: Partial<ReflectionAnswer>,
    reflectionAnswerId: number
  ): Promise<ReflectionAnswer> {
    try {
      const response = await $fetch(`${this.url}/reflectionAnswers/${reflectionAnswerId}/edit`, {
        method: "PUT",
        body: JSON.stringify(answer),
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response as ReflectionAnswer;
    } catch (error) {
      throw new Error(`Failed to create reflection answer: ${error}`);
    }
  }
}

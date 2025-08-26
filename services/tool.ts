import type { Tool } from "~/utils/types";

export class ToolService {
  private url: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
  }

  async getAllTools(): Promise<Tool[]> {
    try {
      const response = await $fetch(`${this.url}/tools`, {
        method: "GET",
      });
      return response as Tool[];
    } catch (error) {
      throw new Error(`Failed to fetch tools: ${error}`);
    }
  }

  async getToolById(id: number): Promise<Tool> {
    try {
      const response = await $fetch(`${this.url}/tools/${id}`, {
        method: "GET",
      });
      return response as Tool;
    } catch (error) {
      throw new Error(`Failed to fetch tool with id ${id}: ${error}`);
    }
  }

  async deleteTool(id: number): Promise<void> {
    try {
      const response = await $fetch(`${this.url}/tools/${id}`, {
        method: "DELETE",
      });
      
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async createTool(
    tool: FormData
  ): Promise<Tool> {
    try {
      const response = await $fetch(`${this.url}/tools`, {
        method: "POST",
        body: tool,
      });

      return response as Tool;
    } catch (error) {
      throw new Error(`Failed to create tool: ${error}`);
    }
  }
}

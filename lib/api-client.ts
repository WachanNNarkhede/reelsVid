import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions<T = unknown> = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: T; // Generic type for body
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T, U = unknown>(
    endpoint: string,
    options: FetchOptions<U> = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch<IVideo[]>("/videos");
  }

  async getVideo(id: string) {
    return this.fetch<IVideo>(`/videos/${id}`);
  }



  async createVideo(videoData: VideoFormData) {
    return this.fetch<IVideo, VideoFormData>("/videos", {
      method: "POST",
      body: videoData, // body is now type-safe
    });
  }
}

export const apiClient = new ApiClient();
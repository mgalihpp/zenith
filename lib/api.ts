class ApiRequest {
  async get<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiRequestResponse<T>> {
    const res = await fetch(`${this.getBaseUrl()}${url}`, {
      method: 'GET',
      ...options,
    });

    return res.json() as ApiRequestResponse<T>;
  }

  getBaseUrl() {
    if (typeof window !== 'undefined') return window.location.origin;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
  }
}

export const api = new ApiRequest();

export default api;

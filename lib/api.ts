import ky, { KyInstance, Options } from 'ky';

class ApiRequest {
  private ky: KyInstance;

  constructor(opts?: Options) {
    this.ky = ky.create(opts);
  }

  async get<T = unknown>(
    url: string,
    options: Options = {}
  ): Promise<ApiRequestResponse<T>> {
    const json = await this.ky
      .get(`${this.getBaseUrl()}${url}`, {
        ...options,
      })
      .json<ApiRequestResponse<T>>();

    return json;
  }

  async post<T = unknown>(
    url: string,
    options: Options = {}
  ): Promise<ApiRequestResponse<T>> {
    const json = await this.ky
      .post(`${this.getBaseUrl()}${url}`, {
        ...options,
      })
      .json<ApiRequestResponse<T>>();

    return json;
  }

  async delete(
    url: string,
    options: Options = {}
  ): Promise<ApiRequestResponse<unknown>> {
    const json = await this.ky
      .delete(`${this.getBaseUrl()}${url}`, {
        ...options,
      })
      .json<ApiRequestResponse<unknown>>();

    return json;
  }

  async patch<T = unknown>(
    url: string,
    options: Options = {}
  ): Promise<ApiRequestResponse<T>> {
    const json = await this.ky
      .patch(`${this.getBaseUrl()}${url}`, {
        ...options,
      })
      .json<ApiRequestResponse<T>>();

    return json;
  }

  getBaseUrl() {
    // if (typeof window !== 'undefined') return window.location.origin;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
  }
}

export const api = new ApiRequest();

export default ApiRequest;

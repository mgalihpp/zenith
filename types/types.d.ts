type Params<T> = Record<string, T>;

type ServerActionResponse<T = unknown> = {
  error?: string;
  data?: T;
};

type ApiResponse = (params: {
  data?: unknown;
  message?: string;
  status?: boolean;
  statusCode?: number;
  httpCode?: number;
}) => void;

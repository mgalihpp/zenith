type Params<T> = Record<string, T>;

type ServerActionResponse<T = unknown> = {
  error?: string;
  data?: T;
};

type ApiResponse<T = unknown> = (params: {
  data?: T;
  message?: string;
  status?: boolean;
  statusCode?: number;
  httpCode?: number;
}) => void;

type ApiRequestResponse<T = unknown> = {
  data?: T;
  message?: string;
  status?: boolean;
  statusCode?: number;
  httpCode?: number;
};

export type ApiResponseSuccess<TData> = {
  success: true;
  data: TData;
  message?: string;
  meta?: Record<string, unknown>;
};

export type ApiResponseError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  message?: string;
};

export type ApiResponse<TData> = ApiResponseSuccess<TData> | ApiResponseError;

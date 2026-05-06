import { type Result, err, ok } from "@justmiracle/result";
import type { ApiResponseError } from "@/types/api-response.type";

/**
 * Custom error class for API fetch failures
 * Uses standardized error structure: { name, message, details } + status
 */
export class ApiFetchError extends Error {
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(
    name: string,
    message: string,
    status: number,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = name;
    this.status = status;
    this.details = details;
  }
}

/**
 * Type-safe wrapper around fetch API with built-in error handling.
 * @param url - Request URL
 * @param options - Fetch options (defaults to GET)
 * @returns Result containing either response data or error
 *
 * @example
 * // GET request
 * const users = await apiFetch<User[]>('/api/users')
 *
 * // POST request
 * const result = await apiFetch<User>('/api/users', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'John' })
 * })
 * if (result.error) return handleError(result.error)
 * console.log(result.value) // TypeScript knows this is User
 */
export async function apiFetch<TResult>(
  url: string,
  options: RequestInit = {},
): Promise<Result<TResult, Error>> {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("text/html")) {
        return err(
          new ApiFetchError(
            "ROUTE_NOT_FOUND",
            `Route not found: ${url}`,
            res.status,
          ),
        );
      }

      const errorData: ApiResponseError = await res.json();

      return err(
        new ApiFetchError(
          errorData.error.code,
          errorData.error.message,
          res.status,
          errorData.error.details,
        ),
      );
    }

    const data = (await res.json()) as TResult;
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

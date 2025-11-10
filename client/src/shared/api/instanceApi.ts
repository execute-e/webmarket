const BASE_URL = 'http://localhost:3000';

class ApiError extends Error {
  constructor(response: Response) {
    super(`ApiError: ${response.status} ${response.statusText}`);
  }
}

export const jsonApiInstance = async <T>(
  url: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> => {
  let headers = init?.headers ?? {};
  if (init?.json) {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
    };
    init.body = JSON.stringify(init.json);
  }

  const result = await fetch(`${BASE_URL}${url}`, {
    ...init,
    headers,
  });

  if (!result.ok) {
    throw new ApiError(result);
  }

  const data = (await result.json()) as T;
  return data;
};
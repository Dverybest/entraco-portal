type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type IParam<TData = unknown> = {
  url: string;
  method: Method;
  data?: TData;
  headers?: HeadersInit;
};

export const fetcher = async <T, TData = unknown>({
  url,
  method,
  data,
  headers,
}: IParam<TData>): Promise<T> => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        statusCode: response.status,
        ...(errorData || { message: response.statusText }),
      };
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw {
        statusCode: 500,
        message: error.message,
      };
    }
    throw error;
  }
}; 
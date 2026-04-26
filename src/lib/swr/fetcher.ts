async function extractError(res: Response, data: unknown): Promise<never> {
  const serverMessage =
    data && typeof data === 'object' && typeof (data as { error?: unknown }).error === 'string'
      ? (data as { error: string }).error
      : null;
  const fallback =
    res.status === 401
      ? 'Unauthorized'
      : res.status === 404
        ? 'Not found'
        : `Request failed with status ${res.status}`;
  throw new Error(serverMessage ?? fallback);
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json().catch(() => null);
  if (!res.ok) await extractError(res, data);
  return data as T;
}

export type MutatorArg =
  | { method: 'POST' | 'PATCH'; body: unknown }
  | { method: 'DELETE'; body?: undefined };

export async function jsonMutator<T>(
  url: string,
  { arg }: { arg: MutatorArg },
): Promise<T> {
  const hasBody = arg.method !== 'DELETE';
  const res = await fetch(url, {
    method: arg.method,
    headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
    body: hasBody ? JSON.stringify(arg.body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) await extractError(res, data);
  return data as T;
}

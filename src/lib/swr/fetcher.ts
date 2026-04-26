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

export type MutatorArg = { method: 'POST' | 'PATCH'; body: unknown };

export async function jsonMutator<T>(
  url: string,
  { arg }: { arg: MutatorArg },
): Promise<T> {
  const res = await fetch(url, {
    method: arg.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg.body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) await extractError(res, data);
  return data as T;
}

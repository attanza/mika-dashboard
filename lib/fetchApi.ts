const API_URL: string = process.env.API_URL || 'https://stg31api.mikaapp.id/api';

export default async (
  url: string,
  method = 'get',
  body: any | undefined = undefined,
  headers = {}
): Promise<any | { error: string }> => {
  // const controller = new AbortController();
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: method.toUpperCase(),
      // signal: controller.signal,
      body: typeof body === 'object' ? JSON.stringify(body) : undefined,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
        ...headers,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw error;
    }
    return await res.json();
  } catch (err) {
    throw err;
  } finally {
    // controller.abort();
  }
};

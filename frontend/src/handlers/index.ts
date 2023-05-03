export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

const checkPath = (path: string) => {
  if (!path.startsWith("/")) {
    throw new Error(`Path must start with /. Got: ${path}`);
  }
};

// Use instead of `fetch` for requests to relayer API endpoint.
// Since Next API routes do not specify CORS headers, that means they're same origin only, which means we don't
// need to worry about authentication.
export const callServerlessApi = async (
  path: string,
  method: HttpMethod,
  body?: string
) => {
  checkPath(path);
  return await fetch(`${window.location.origin}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
};

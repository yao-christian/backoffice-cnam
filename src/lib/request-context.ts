import { AsyncLocalStorage } from "node:async_hooks";

export type RequestContext = {
  userId?: string;
  ip?: string | null;
  userAgent?: string | null;
  requestId?: string;
};

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext {
  return requestContext.getStore() ?? {};
}

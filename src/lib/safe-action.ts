import { redirect } from "next/navigation";
import { createSafeActionClient } from "next-safe-action";

import { UserNotAuthenticatedError } from "@/utils/errors";
import { isAuthenticated } from "@/features/auth/auth-session";

export const authAction = createSafeActionClient({
  handleServerError(e, utils) {
    console.error(Date.now(), e.message);

    if (e instanceof UserNotAuthenticatedError) {
      redirect("/login");
    }

    return e.message;
  },
}).use(async ({ next, clientInput, metadata }) => {
  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    throw new UserNotAuthenticatedError(
      "Vous n'êtes pas authorisé à mener cette action",
    );
  }

  console.log("-------LOGGING MIDDLEWARE-------");

  const startTime = performance.now();

  // Here we await the action execution.
  const result = await next();

  const endTime = performance.now();

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);
  console.log("Action execution took", endTime - startTime, "ms");

  // And then return the result of the awaited action.
  return result;
});

export const action = createSafeActionClient({
  handleServerError(e) {
    return e.message;
  },
});

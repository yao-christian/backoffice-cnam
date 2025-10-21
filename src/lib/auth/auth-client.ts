import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
});

// const { data, error } = await authClient.emailOtp.sendVerificationOtp({
//   email: "user@example.com", // required
//   type: "sign-in", // required
// });

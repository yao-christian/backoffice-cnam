import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";

export async function sendPasswordResetOtp(email: string) {
  const url = `${process.env.API_URL}/api/user/linkpwd`;
  const form = new FormData();
  form.append("email", email);

  const res = await customFetch(url, {
    method: "POST",
    body: form,
    isAuth: false,
  });

  if (!res.ok) {
    throw HttpError.fromResponse(res);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return { status: "success", message: "OTP envoyé (pas de JSON renvoyé)" };
  }

  const body = await res.json();
  if (body?.status !== "success") {
    throw new HttpError(
      body?.message || "Échec d'envoi de l'OTP.",
      422,
      "APPLICATION_ERROR",
    );
  }

  return body;
}

export async function verifyPasswordResetOtp(otp: string, email: string) {
  const url = `${process.env.API_URL}/api/user/verifyOtp`;

  const form = new FormData();
  form.append("email", email);
  form.append("otp_code", otp);

  const res = await customFetch(url, {
    method: "POST",
    body: form,
    isAuth: false,
  });

  if (!res.ok) throw HttpError.fromResponse(res);

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return { status: "success", message: "OTP validé (pas de JSON renvoyé)" };
  }

  const body = await res.json();

  if (body?.status !== "success") {
    throw new HttpError(
      body?.message || "Échec de la validation OTP.",
      422,
      "APPLICATION_ERROR",
    );
  }

  return body; // {status: "success", message: "..."}
}

export async function initPasswordByOtp(params: {
  email: string;
  otp: string;
  password: string;
  passwordConfirmation: string;
}) {
  const url = `${process.env.API_URL}/api/user/initpwd`;

  const form = new FormData();
  form.append("email", params.email);
  form.append("otp_code", params.otp);
  form.append("password", params.password);
  form.append("password_confirmation", params.passwordConfirmation);

  const res = await customFetch(url, {
    method: "POST",
    body: form,
    isAuth: false,
  });

  if (!res.ok) throw HttpError.fromResponse(res);

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return {
      status: "success",
      message: "Mot de passe réinitialisé (pas de JSON renvoyé)",
    };
  }

  const body = await res.json();

  if (body?.status !== "success") {
    throw new HttpError(
      body?.message || "Échec de la réinitialisation du mot de passe.",
      422,
      "APPLICATION_ERROR",
    );
  }

  return body; // {status: "success", message: "..."}
}

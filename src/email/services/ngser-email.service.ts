import { CustomError } from "@/utils/errors";

export interface SendEmailOption {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export const ngserEmailService = async (options: SendEmailOption) => {
  const { to, subject, html } = options;

  try {
    const res = await fetch(
      `${process.env.BASE_URL_NGSER_MAIL_API}/api/token/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: process.env.USERNAME_NGSER_EMAIL_API,
          password: process.env.PASSWORD_NGSER_EMAIL_API,
        }),
        cache: "no-cache",
      },
    );

    if (!res.ok) {
      throw new CustomError(
        "Erreur auhtentification service d'envoi de mail !",
      );
    }

    const resData = await res.json();

    if (!resData.access) {
      throw new CustomError(
        "Erreur auhtentification service d'envoi de mail !",
      );
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("body", html);
    formData.append("to", to);

    const res2 = await fetch(
      `${process.env.BASE_URL_NGSER_MAIL_API}/sendmail/`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${resData.access}` },
        body: formData,
        cache: "no-cache",
      },
    );

    if (!res2.ok) {
      throw new CustomError("Erreur d'envoi de mail !");
    }

    const resData2 = await res2.json();

    if (resData2.status != 200) {
      throw new CustomError(resData2.message ?? "Erreur d'envoi de mail !");
    }
  } catch (error) {
    console.error(error);

    if (error instanceof CustomError) {
      throw new CustomError(error.message);
    } else {
      throw new CustomError("Erreur lors de l'envoi du mail !");
    }
  }
};

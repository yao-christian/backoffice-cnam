import { Service } from "./service.type";

export const getAllServices = async () => {
  const response = await fetch("/api/services/all", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      "La récuperation des services a échoué, veuillez réessayer.",
    );
  }

  const responseData = await response.json();

  return responseData.data as Service[];
};

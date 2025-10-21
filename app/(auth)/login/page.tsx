"use client";

import { useSearchParams } from "next/navigation";

import LoginForm from "./form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

enum Error {
  Configuration = "Configuration",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      Un problème est survenu lors de la tentative d'authentification. Veuillez
      nous contacter si cette erreur persiste.
    </p>
  ),
};

export default function LoginPage() {
  const search = useSearchParams();
  const error = search.get("error") as Error;

  return (
    <Card className="mx-auto mt-6 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-gray text-center font-bold">
          <span>Connexion</span> |{" "}
          <span className="text-primary underline">Panel administration</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <LoginForm />

        {error ? (
          <div className="mt-5 block max-w-sm cursor-pointer rounded-lg border border-red-200 bg-red-100 p-6 text-center shadow hover:bg-red-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Connexion échoué
            </h5>
            <div className="font-normal text-gray-700 dark:text-gray-400">
              {errorMap[error] ||
                "Veuillez nous contacter si cette erreur persiste"}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

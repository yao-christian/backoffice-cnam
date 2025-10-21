import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import NewPasswordForm from "./form";

export default function NewPasswordPage() {
  return (
    <div className="m-6 mb-10">
      <Card className="mx-auto mt-8 w-full max-w-md">
        <CardHeader>
          <CardTitle>Nouveau mot de passe</CardTitle>
          <CardDescription>
            Veuillez saisir le code otp reçu et un nouveau mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}

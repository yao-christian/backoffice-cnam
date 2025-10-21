import { LayoutParams } from "@/types/next";

export default async function ProfileLayout({ children }: LayoutParams<{}>) {
  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-md">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="mb-2 text-2xl font-bold">Mon profil</h1>
          <p className="text-blue-50">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

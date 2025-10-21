import { LayoutParams } from "@/types/next";

export default async function AuthLayout({ children }: LayoutParams<{}>) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-4 py-10 md:block md:w-1/2 md:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full md:w-full">
          <div className="flex justify-center md:mt-[20%]">
            <div className="flex items-center">
              <img className="h-[50px] w-auto" src="/images/logo.png" />
            </div>
          </div>
          {children}
        </div>
      </div>

      <div className="fixed bottom-0 right-0 top-0 hidden sm:w-1/2 md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/auth-illustration.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="flex h-full items-center justify-center text-white">
          <div className="z-10">
            <h2 className="mb-4 text-3xl font-bold">Bienvenue</h2>
            <p className="text-lg">
              Connectez-vous pour accéder à votre espace personnel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

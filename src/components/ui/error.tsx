import { Button } from "./button";

type PropsType = {
  actionLabel?: string;
  action?: () => void;
  error?: string;
};

export default function ErrorPage({
  action,
  actionLabel = "Réessayez",
  error = "Une erreur s'est produite, veuillez réessayer.",
}: PropsType) {
  return (
    <div className="flex items-center justify-center h-screen -mt-16">
      <div className="container">
        <div className="text-center">
          <p className="font-semibold">Oops!</p>

          <h1 className="text-9xl font-sans font-bold text-red-500">
            <span>Erreur</span>
          </h1>

          <p>{error}</p>

          {actionLabel && action && (
            <div className="mt-8">
              <Button
                onClick={action}
                className="bg-red-400 px-5 py-3 text-sm shadow-sm font-medium text-gray-50 rounded-full hover:shadow-lg"
              >
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

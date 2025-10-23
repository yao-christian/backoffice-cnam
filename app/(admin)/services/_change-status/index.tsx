import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { changeServiceStatusAction } from "./actions";
import { ToggleLeft, ToggleRight } from "lucide-react";

import { useAlertDialogStore } from "@/components/global-alert-dialog/store";
import { toast } from "react-toastify";
import { Service } from "@/features/service/service.type";

type PropsType = {
  service: Service;
};

export function ChangeServiceStatus({ service }: PropsType) {
  const router = useRouter();

  const startLoading = useAlertDialogStore.use.startLoading();
  const showAlert = useAlertDialogStore.use.showAlert();
  const closeAlert = useAlertDialogStore.use.closeAlert();
  const onError = useAlertDialogStore.use.onError();

  const { execute } = useAction(changeServiceStatusAction, {
    onSuccess(response) {
      router.refresh();
      toast.success(response.data);
      closeAlert();
    },
    onError(error) {
      onError({
        errorMessage: error.error.serverError || "Une erreur est survenue",
      });
    },
  });

  const handleChangeServiceStatus = () => {
    startLoading();
    execute({ uuid: service.uuid!, status: !!service.status });
  };

  if (service.status) {
    return (
      <ToggleRight
        className="cursor-pointer text-green-600 hover:text-green-700"
        onClick={() =>
          showAlert({
            title: "Confirmer la désactivation",
            content: `Voulez-vous désactiver le service ${service.name} ?`,
            confirmAction: handleChangeServiceStatus,
          })
        }
      />
    );
  }

  return (
    <ToggleLeft
      className="cursor-pointer text-gray-500"
      onClick={() =>
        showAlert({
          title: "Confirmer l'activation",
          content: `Voulez-vous activer le service ${service.name} ?`,
          confirmAction: handleChangeServiceStatus,
        })
      }
    />
  );
}

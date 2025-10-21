import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { changeServiceStatusAction } from "./actions";
import { ToggleLeft, ToggleRight } from "lucide-react";

import { useAlertDialogStore } from "@/components/global-alert-dialog/store";
import { Service } from "@/features/service/service.type";
import { DEFAULT_STATUS } from "@/constants/status";

type PropsType = {
  service: Service;
};

export function ChangeServiceStatus({ service }: PropsType) {
  const router = useRouter();

  const showAlert = useAlertDialogStore.use.showAlert();
  const onSuccess = useAlertDialogStore.use.onSuccess();
  const onError = useAlertDialogStore.use.onError();

  const { execute } = useAction(changeServiceStatusAction, {
    onSuccess(response) {
      router.refresh();
      onSuccess({ successMessage: response.data });
    },
    onError(error) {
      onError({
        errorMessage: error.error.serverError || "Une erreur est survenue",
      });
    },
  });

  const handleChangeServiceStatus = () => {
    // if (service.statusCode === DEFAULT_STATUS.active.code) {
    //   execute({ id: service.id, newStatus: DEFAULT_STATUS.disable });
    // } else {
    //   execute({ id: service.id, newStatus: DEFAULT_STATUS.active });
    // }
  };

  // if (service.statusCode === DEFAULT_STATUS.active.code) {
  if (true) {
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

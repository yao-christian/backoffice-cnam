import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { deleteRoleAction } from "./actions";
import { Trash2 } from "lucide-react";

import { useAlertDialogStore } from "@/components/global-alert-dialog/store";
import { toast } from "react-toastify";
import { Role } from "@/features/role/role.type";

type PropsType = {
  role: Role;
};

export function DeleteRole({ role }: PropsType) {
  const router = useRouter();

  const startLoading = useAlertDialogStore.use.startLoading();
  const showAlert = useAlertDialogStore.use.showAlert();
  const closeAlert = useAlertDialogStore.use.closeAlert();
  const onError = useAlertDialogStore.use.onError();

  const { execute } = useAction(deleteRoleAction, {
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

  const handleDelete = () => {
    startLoading();
    execute(role.uuid!);
  };

  return (
    <Trash2
      size={16}
      className="cursor-pointer text-red-500"
      onClick={() =>
        showAlert({
          title: "Confirmer la suppression",
          content: `Voulez-vous supprimer le rôle ${role.name} ?`,
          confirmAction: handleDelete,
        })
      }
    />
  );
}

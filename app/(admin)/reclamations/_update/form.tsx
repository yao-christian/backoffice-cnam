"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { EditIcon } from "lucide-react";
import { useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { updateClaimAction } from "./actions";

import { useModalStore } from "@/components/global-modal/store";
import { toast } from "react-toastify";
import { Claim } from "@/features/claim/claim.type";

import {
  UpdateClaimInput,
  UpdateClaimSchema,
} from "@/features/claim/schemas/claim.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function UpdateClaim({ claim }: { claim: Claim }) {
  const showModal = useModalStore.use.showModal();
  return (
    <EditIcon
      size={16}
      className="cursor-pointer text-green-600 hover:text-green-700"
      onClick={() =>
        showModal({
          title: "Modification du rôle",
          content: <ClaimForm claim={claim} />,
        })
      }
    />
  );
}

type PropsType = React.ComponentProps<"form"> & {
  claim: Claim;
};

export default function ClaimForm(props: PropsType) {
  const { className, claim } = props;

  const setConfirmAction = useModalStore.use.setConfirmAction();
  const closeModal = useModalStore.use.closeModal();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();

  const router = useRouter();

  const form = useForm<UpdateClaimInput>({
    resolver: zodResolver(UpdateClaimSchema, {}, { raw: true }),
    defaultValues: {
      id: claim.id,
      comment: claim.comment ?? "",
      status: claim.statusId ?? 0,
    },
  });

  const { execute } = useAction(updateClaimAction, {
    onSuccess() {
      router.refresh();
      toast.success("Modification éffectuée avec succès.");
      closeModal();
    },
    onError(error) {
      onError({
        errorMessage: error.error.serverError || "Une erreur est survenue",
        canResubmit: true,
      });
    },
  });

  const onSubmit = (values: UpdateClaimInput) => {
    startLoading();
    execute(values);
  };

  useEffect(() => {
    setConfirmAction(form.handleSubmit(onSubmit));
  }, [form.getValues, setConfirmAction]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={clsx("my-4 grid items-start gap-6", className)}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-6">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Commentaire</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Commentaire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Statut */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Statut</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}

const statusOptions = [
  { value: 0, label: "En cours" }, // IN_PROGRESS
  { value: 1, label: "En attente" }, // PENDING
  { value: 2, label: "Résolue" }, // RESOLVED
  { value: 3, label: "Fermée" }, // CLOSED
  { value: 7, label: "Initiée" }, // INITIATED
];

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

import { updateClaimPatternAction } from "./actions";

import { useModalStore } from "@/components/global-modal/store";
import { toast } from "react-toastify";
import { ClaimPattern } from "@/features/claim-pattern/claim-pattern.type";

import {
  UpdateClaimPatternInput,
  UpdateClaimPatternSchema,
} from "@/features/claim-pattern/schemas/claim-pattern.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UpdateClaimPattern({
  claimPattern,
}: {
  claimPattern: ClaimPattern;
}) {
  const showModal = useModalStore.use.showModal();
  return (
    <EditIcon
      size={16}
      className="cursor-pointer text-green-600 hover:text-green-700"
      onClick={() =>
        showModal({
          title: "Modification du rôle",
          content: <ClaimPatternForm claimPattern={claimPattern} />,
        })
      }
    />
  );
}

type PropsType = React.ComponentProps<"form"> & {
  claimPattern: ClaimPattern;
};

export default function ClaimPatternForm(props: PropsType) {
  const { className, claimPattern } = props;

  const setConfirmAction = useModalStore.use.setConfirmAction();
  const closeModal = useModalStore.use.closeModal();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();

  const router = useRouter();

  const form = useForm<UpdateClaimPatternInput>({
    resolver: zodResolver(UpdateClaimPatternSchema, {}, { raw: true }),
    defaultValues: {
      id: claimPattern.id,
      label: claimPattern.label ?? "",
      status: claimPattern.status ?? 0,
    },
  });

  const { execute } = useAction(updateClaimPatternAction, {
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

  const onSubmit = (values: UpdateClaimPatternInput) => {
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
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Libellé</FormLabel>
                  <FormControl>
                    <Input placeholder="Libellé" {...field} />
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

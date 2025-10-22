"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { PlusCircle } from "lucide-react";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

import { createClaimPatternAction } from "./actions";

import { useModalStore } from "@/components/global-modal/store";
import { toast } from "react-toastify";
import {
  CreateClaimPatternInput,
  CreateClaimPatternSchema,
} from "@/features/claim-pattern/schemas/claim-pattern.schema";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateClaimPattern() {
  const showModal = useModalStore.use.showModal();

  return (
    <Button
      className={clsx(buttonVariants(), "ml-auto")}
      onClick={() =>
        showModal({
          title: "Création de motif",
          content: <ClaimPatternForm />,
        })
      }
    >
      Ajouter un motif <PlusCircle className="ml-2 h-4 w-4" />
    </Button>
  );
}

const initialValues: CreateClaimPatternInput = {
  label: "",
  status: 0,
};

type PropsType = React.ComponentProps<"form"> & {};

function ClaimPatternForm(props: PropsType) {
  const setConfirmAction = useModalStore.use.setConfirmAction();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();
  const closeModal = useModalStore.use.closeModal();

  const { className } = props;

  const router = useRouter();

  const form = useForm<CreateClaimPatternInput>({
    resolver: zodResolver(CreateClaimPatternSchema, {}, { raw: true }),
    defaultValues: initialValues,
  });

  const { execute } = useAction(createClaimPatternAction, {
    onSuccess(response) {
      toast.success(response.data, {
        position: "bottom-right",
      });
      router.refresh();
      closeModal();
    },
    onError(error) {
      onError({
        errorMessage: error.error.serverError || "Une erreur est survenue",
        canResubmit: true,
      });
    },
  });

  const onSubmit = (values: CreateClaimPatternInput) => {
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

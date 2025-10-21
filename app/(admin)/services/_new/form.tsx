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

import { createServiceAction } from "./actions";

import { CreateServiceFormSchema, CreateServiceFormType } from "./schema";

import { useModalStore } from "@/components/global-modal/store";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";

export function CreateService() {
  const showModal = useModalStore.use.showModal();

  return (
    <Button
      className={clsx(buttonVariants(), "ml-auto")}
      onClick={() =>
        showModal({
          title: "Création de service",
          content: <SellerForm />,
        })
      }
    >
      Ajouter un service <PlusCircle className="ml-2 h-4 w-4" />
    </Button>
  );
}

const initialValues: CreateServiceFormType = {
  name: "",
  prepaid: false,
  prepaidServiceName: "",
  apiKey: "",
  apiSecret: "",
};

type PropsType = React.ComponentProps<"form"> & {};

function SellerForm(props: PropsType) {
  const setConfirmAction = useModalStore.use.setConfirmAction();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();
  const closeModal = useModalStore.use.closeModal();

  const { className } = props;

  const router = useRouter();

  const form = useForm<CreateServiceFormType>({
    resolver: zodResolver(CreateServiceFormSchema, {}, { raw: true }),
    defaultValues: initialValues,
  });

  const prepaid = form.watch("prepaid");

  const { execute } = useAction(createServiceAction, {
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

  const onSubmit = (values: CreateServiceFormType) => {
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
            {/* Nom */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Cotisations CMU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prépayé (Checkbox shadcn) */}
            <FormField
              control={form.control}
              name="prepaid"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // shadcn Checkbox -> boolean | "indeterminate"
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  </FormControl>
                  <FormLabel className="m-0">Prépayé</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champs conditionnels si prepaid === true */}
            {prepaid && (
              <>
                <FormField
                  control={form.control}
                  name="prepaidServiceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du service prépayé</FormLabel>
                      <FormControl>
                        {/* Evite null : value ?? "" */}
                        <Input
                          placeholder="Ex. ORANGE MONEY CI"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex. CNAM-FASTPAY"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API secret</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex. CpsrxkdjfndvRsdkb6iC"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}

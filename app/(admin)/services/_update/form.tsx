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

import { updateServiceAction } from "./actions";

import { UpdateServiceFormSchema, UpdateServiceFormType } from "./schema";

import { useModalStore } from "@/components/global-modal/store";
import { toast } from "react-toastify";
import { Service } from "@/features/service/service.type";
import { Checkbox } from "@/components/ui/checkbox";

export function UpdateService({ service }: { service: Service }) {
  const showModal = useModalStore.use.showModal();

  return (
    <EditIcon
      size={16}
      className="cursor-pointer text-green-600 hover:text-green-700"
      onClick={() =>
        showModal({
          title: "Modification du service",
          content: <ServiceForm service={service} />,
        })
      }
    />
  );
}

type PropsType = React.ComponentProps<"form"> & {
  service: Service;
};

export default function ServiceForm(props: PropsType) {
  const { className, service } = props;

  const setConfirmAction = useModalStore.use.setConfirmAction();
  const closeModal = useModalStore.use.closeModal();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();

  const router = useRouter();

  const form = useForm<UpdateServiceFormType>({
    resolver: zodResolver(UpdateServiceFormSchema, {}, { raw: true }),
    defaultValues: {
      uuid: service.uuid ?? undefined,
      name: service.name,
      prepaid: service.prepaid,
      prepaidServiceName: service.prepaidServiceName ?? undefined,
      apiKey: service.apiKey ?? undefined,
      apiSecret: service.apiSecret ?? undefined,
    },
  });

  const prepaid = form.watch("prepaid");

  const { execute } = useAction(updateServiceAction, {
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

  const onSubmit = (values: UpdateServiceFormType) => {
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

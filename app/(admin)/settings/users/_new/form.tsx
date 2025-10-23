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

import { createUserAction } from "./actions";

import { useModalStore } from "@/components/global-modal/store";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";

import {
  CreateUserInput,
  CreateUserSchema,
} from "@/features/user/schemas/role.schemas";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoles } from "@/features/role/role.hook";

export function CreateUser() {
  const showModal = useModalStore.use.showModal();

  return (
    <Button
      className={clsx(buttonVariants(), "ml-auto")}
      onClick={() =>
        showModal({
          title: "Création d'utilisateur",
          content: <SellerForm />,
        })
      }
    >
      Ajouter un utilisateur <PlusCircle className="ml-2 h-4 w-4" />
    </Button>
  );
}

const initialValues: CreateUserInput = {
  status: 0,
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  roleId: "",
  password: "",
  passwordConfirmation: "",
};

type PropsType = React.ComponentProps<"form"> & {};

function SellerForm(props: PropsType) {
  const setConfirmAction = useModalStore.use.setConfirmAction();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();
  const closeModal = useModalStore.use.closeModal();

  const { data: rolesOptions } = useRoles();

  const { className } = props;

  const router = useRouter();

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema, {}, { raw: true }),
    defaultValues: initialValues,
  });

  const statusValue = form.watch("status");

  const statusChecked = Boolean(
    typeof statusValue === "number" ? statusValue === 1 : statusValue,
  );

  const { execute } = useAction(createUserAction, {
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

  const onSubmit = (values: CreateUserInput) => {
    startLoading();
    execute(values);
  };

  useEffect(() => {
    setConfirmAction(form.handleSubmit(onSubmit));
  }, [form.getValues, setConfirmAction]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={clsx("my-4 grid items-start gap-6", className)}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-6">
          {/* Nom */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="KONATE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prénom */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Ibrahima" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ibson@yopmail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Téléphone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="0702130411" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rôle */}
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Rôle</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesOptions?.data?.map((r) => (
                        <SelectItem key={r.uuid} value={r.uuid!}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

          {/* Mot de passe */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Azerty@123"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirmation du mot de passe */}
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Confirmation du mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

const statusOptions = [
  { value: 0, label: "En cours" }, // IN_PROGRESS
  { value: 1, label: "En attente" }, // PENDING
  { value: 2, label: "Résolue" }, // RESOLVED
  { value: 3, label: "Fermée" }, // CLOSED
  { value: 7, label: "Initiée" }, // INITIATED
];

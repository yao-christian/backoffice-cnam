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

import { updateUserAction } from "./actions";

import { useModalStore } from "@/components/global-modal/store";
import { toast } from "react-toastify";
import { User } from "@/features/user/user.type";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UpdateUserInput,
  UpdateUserSchema,
} from "@/features/user/schemas/role.schemas";

export function UpdateUser({ user }: { user: User }) {
  const showModal = useModalStore.use.showModal();

  return (
    <EditIcon
      size={16}
      className="cursor-pointer text-green-600 hover:text-green-700"
      onClick={() =>
        showModal({
          title: "Modification de l'utilisateur",
          content: <UserForm user={user} />,
        })
      }
    />
  );
}

type PropsType = React.ComponentProps<"form"> & {
  user: User;
};

export default function UserForm(props: PropsType) {
  const { className, user } = props;

  const setConfirmAction = useModalStore.use.setConfirmAction();
  const closeModal = useModalStore.use.closeModal();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();

  const router = useRouter();

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema, {}, { raw: true }),
    defaultValues: {
      uuid: user.uuid ?? undefined,
      lastName: user.lastName ?? "",
      firstName: user.firstName ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      roleId: user.roles?.[0]?.uuid ?? undefined,
      status: user.status === 1,
      password: "",
      passwordConfirmation: "",
    },
  });

  const statusValue = form.watch("status");

  const statusChecked = Boolean(
    typeof statusValue === "number" ? statusValue === 1 : statusValue,
  );

  const { execute } = useAction(updateUserAction, {
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

  const onSubmit = (values: UpdateUserInput) => {
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
          {/* <FormField
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
                       {rolesOptions.map((r) => (
                         <SelectItem key={r.value} value={r.value}>
                           {r.label}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           /> */}

          {/* Statut (Actif) */}
          <FormField
            control={form.control}
            name="status"
            render={() => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Checkbox
                    checked={statusChecked}
                    onCheckedChange={(v) => {
                      const next = Boolean(v);
                      // on autorise status à être bool côté form pour UX
                      form.setValue("status", next as unknown as any, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </FormControl>
                <FormLabel className="m-0">Actif</FormLabel>
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

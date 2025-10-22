"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { EditIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

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

import { useModalStore } from "@/components/global-modal/store";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Role } from "@/features/role/role.type";
import { ACTIONS, MENUS } from "@/features/role/permissions.const";
import {
  UpdateRoleInput,
  UpdateRoleSchema,
} from "@/features/role/schemas/role.schemas";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function UpdateRole({ role }: { role: Role }) {
  const showModal = useModalStore.use.showModal();
  return (
    <EditIcon
      size={16}
      className="cursor-pointer text-green-600 hover:text-green-700"
      onClick={() =>
        showModal({
          title: "Modification du rôle",
          content: <RoleForm currentRole={role} />,
        })
      }
    />
  );
}

type PropsType = React.ComponentProps<"form"> & {
  currentRole: Role;
};

export default function RoleForm(props: PropsType) {
  const { className, currentRole: role } = props;

  const setConfirmAction = useModalStore.use.setConfirmAction();
  const closeModal = useModalStore.use.closeModal();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();

  const router = useRouter();

  const form = useForm<UpdateRoleInput>({
    resolver: zodResolver(UpdateRoleSchema, {}, { raw: true }),
    defaultValues: {
      uuid: role.uuid,
      name: role.name ?? "",
      description: role.description ?? "",
      status: role.status === 1,
      permissions: [],
    },
  });

  const matrix = useMemo(() => {
    return MENUS.map((menu) => ({
      menu,
      actions: ACTIONS.map((a) => ({ action: a, key: `${a}:${menu}` })),
    }));
  }, []);

  // Helpers checkbox
  const togglePermission = (
    checked: boolean | "indeterminate",
    key: string,
    current: string[],
    onChange: (v: string[]) => void,
  ) => {
    const isChecked = Boolean(checked);
    if (isChecked && !current.includes(key)) onChange([...current, key]);
    if (!isChecked && current.includes(key))
      onChange(current.filter((k) => k !== key));
  };

  const toggleRow = (
    menu: string,
    checked: boolean,
    current: string[],
    onChange: (v: string[]) => void,
  ) => {
    const rowKeys = ACTIONS.map((a) => `${a}:${menu}`);
    if (checked) {
      const merged = Array.from(new Set([...current, ...rowKeys]));
      onChange(merged);
    } else {
      onChange(current.filter((k) => !rowKeys.includes(k)));
    }
  };

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

  const onSubmit = (values: UpdateRoleInput) => {
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Nom du rôle</FormLabel>
                <FormControl>
                  <Input placeholder="Super administrateur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Profil du super administrateur"
                    {...field}
                  />
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
              <FormItem className="flex items-center gap-3">
                <FormLabel className="m-0">Statut</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <span className="text-sm text-muted-foreground">
                  {field.value ? "Actif" : "Inactif"}
                </span>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Permissions */}
          <Controller
            control={form.control}
            name="permissions"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Permissions</FormLabel>
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full table-auto text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Menu</th>
                        {ACTIONS.map((a) => (
                          <th
                            key={a}
                            className="px-3 py-2 text-center capitalize"
                          >
                            {a}
                          </th>
                        ))}
                        <th className="px-3 py-2 text-center">Tout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrix.map(({ menu, actions }) => {
                        const rowKeys = actions.map((x) => x.key);
                        const allChecked = rowKeys.every((k) =>
                          field.value.includes(k),
                        );
                        const someChecked =
                          !allChecked &&
                          rowKeys.some((k) => field.value.includes(k));

                        return (
                          <tr key={menu} className="border-t">
                            <td className="px-3 py-2 font-medium">{menu}</td>

                            {actions.map(({ action, key }) => (
                              <td key={key} className="px-3 py-2 text-center">
                                <Checkbox
                                  checked={field.value.includes(key)}
                                  onCheckedChange={(v) =>
                                    togglePermission(
                                      v,
                                      key,
                                      field.value,
                                      field.onChange,
                                    )
                                  }
                                  aria-label={`${action} ${menu}`}
                                />
                              </td>
                            ))}

                            {/* Tout (ligne) */}
                            <td className="px-3 py-2 text-center">
                              <Checkbox
                                checked={
                                  allChecked
                                    ? true
                                    : someChecked
                                      ? "indeterminate"
                                      : false
                                }
                                onCheckedChange={(v) =>
                                  toggleRow(
                                    menu,
                                    Boolean(v),
                                    field.value,
                                    field.onChange,
                                  )
                                }
                                aria-label={`Tout ${menu}`}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

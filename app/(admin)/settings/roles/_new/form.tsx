"use client";

import { useEffect, useMemo } from "react";
import clsx from "clsx";
import { PlusCircle } from "lucide-react";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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

import { createRoleAction } from "./actions";

import { useModalStore } from "@/components/global-modal/store";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import {
  CreateRoleInput,
  CreateRoleSchema,
} from "@/features/roles/schemas/role.schemas";
import { ACTIONS, MENUS } from "@/features/roles/permissions.const";
import { Textarea } from "@/components/ui/textarea";

export function CreateRole() {
  const showModal = useModalStore.use.showModal();

  return (
    <Button
      className={clsx(buttonVariants(), "ml-auto")}
      onClick={() =>
        showModal({
          title: "Création de role",
          content: <RoleForm />,
        })
      }
    >
      Ajouter un role <PlusCircle className="ml-2 h-4 w-4" />
    </Button>
  );
}

const initialValues: CreateRoleInput = {
  name: "",
  description: "",
  permissions: [],
};

type PropsType = React.ComponentProps<"form"> & {};

function RoleForm(props: PropsType) {
  const setConfirmAction = useModalStore.use.setConfirmAction();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();
  const closeModal = useModalStore.use.closeModal();

  const { className } = props;

  const router = useRouter();

  const form = useForm<CreateRoleInput>({
    resolver: zodResolver(CreateRoleSchema, {}, { raw: true }),
    defaultValues: initialValues,
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

  const { execute } = useAction(createRoleAction, {
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

  const onSubmit = (values: CreateRoleInput) => {
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
    </>
  );
}

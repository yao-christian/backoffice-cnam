"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
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

import { updateProfileAction } from "./actions";

import { UpdateProfileFormSchema, UpdateProfileFormTypeInput } from "./schema";

import { useModalStore } from "@/components/global-modal/store";
import { ProfileUser } from "@/features/profile/profile.type";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

export function UpdateProfile({ profile }: { profile: ProfileUser }) {
  const showModal = useModalStore.use.showModal();

  return (
    <Button
      onClick={() =>
        showModal({
          title: "Modification du profil",
          content: <ProfileForm profile={profile} />,
        })
      }
    >
      Modifier le profil
    </Button>
  );
}

type PropsType = React.ComponentProps<"form"> & {
  profile: ProfileUser;
};

export default function ProfileForm(props: PropsType) {
  const { className, profile } = props;

  const setConfirmAction = useModalStore.use.setConfirmAction();
  const closeModal = useModalStore.use.closeModal();
  const onError = useModalStore.use.onError();
  const startLoading = useModalStore.use.startLoading();

  const router = useRouter();

  const form = useForm<UpdateProfileFormTypeInput>({
    resolver: zodResolver(UpdateProfileFormSchema, {}, { raw: true }),
    defaultValues: {
      id: profile.id,
      lastName: profile.lastName,
      firstName: profile.firstName ?? undefined,
      email: profile.email,
      phoneNumber: profile.phoneNumber ?? undefined,
    },
  });

  const { execute } = useAction(updateProfileAction, {
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

  const onSubmit = (values: UpdateProfileFormTypeInput) => {
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
            <div className="col-span-full">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-full">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénoms</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénoms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Téléphone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Téléphone" {...field} />
                  </FormControl>
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

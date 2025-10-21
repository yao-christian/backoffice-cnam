"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";

import { z } from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";

import { CredentialsSchema } from "@/features/auth/auth.schema";
import { loginAction } from "./actions";
import { Loader } from "@/components/ui/loader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type UserCredentials = z.infer<typeof CredentialsSchema>;

export default function LoginForm() {
  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState(false);
  const router = useRouter();

  const { execute, status, result } = useAction(loginAction, {
    onSuccess: ({ data }) => {
      toast.success("Bienvenue dans votre espace !", {
        position: "bottom-right",
      });
    },
  });

  const form = useForm<UserCredentials>({
    resolver: zodResolver(CredentialsSchema),
    defaultValues: { email: "ngser@cnam.com", password: "Azerty@123" },
    disabled: status === "executing",
  });

  const onSubmit = async (values: UserCredentials) => {
    execute(values);
  };

  const toggle = () => {
    setIsPasswordDisplayed((prevState) => !prevState);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="christian@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          className="rounded-r-none"
                          placeholder="Mot de passe"
                          type={isPasswordDisplayed ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          variant="outline"
                          type="button"
                          className="rounded-l-none bg-slate-100"
                          onClick={toggle}
                        >
                          {isPasswordDisplayed ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="link"
                  asChild
                  className="px-0 font-normal"
                >
                  <Link href="reset-password">Mot de passe oublié ?</Link>
                </Button>
              </div>
            </div>
          </div>

          {result.serverError ? (
            <div className="my-2 flex items-center gap-x-2 rounded border border-red-200 bg-red-100 p-2 text-xs font-semibold text-red-500">
              <TriangleAlert size={18} />
              <span>{result.serverError}</span>
            </div>
          ) : null}

          <Button
            disabled={status === "executing"}
            className="mt-10 flex w-full items-center"
            type="submit"
          >
            Se connecter
            {status === "executing" && <Loader />}
          </Button>
        </form>
      </Form>
    </>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { CheckCircle, TriangleAlert } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { resetPassword } from "./actions";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { ResetPasswordSchema } from "./schema";
import { ResetPasswordFormInput } from "./types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ResetPasswordForm() {
  const router = useRouter();

  const form = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: "" },
  });

  const { execute, status, result } = useAction(resetPassword, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success(data.message, { position: "bottom-right" });
        router.push(`new-password?email=${form.getValues().email}`);
      }
    },
  });

  const onSubmit = async (values: ResetPasswordFormInput) => {
    execute(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mt-6 space-y-10">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {result.serverError ? (
            <div className="my-2 flex items-center gap-x-2 rounded border border-red-200 bg-red-100 p-2 text-xs font-semibold text-red-500">
              <TriangleAlert size={18} />
              <span>{result.serverError}</span>
            </div>
          ) : null}

          {result.data ? (
            <div className="my-2 flex items-center gap-x-2 rounded border border-green-200 bg-green-100 p-2 text-xs font-semibold text-green-500">
              <CheckCircle size={18} />
              <span>{result.data.message}</span>
            </div>
          ) : null}

          <Button
            disabled={status === "executing"}
            className="mt-10 flex w-full items-center"
            type="submit"
          >
            Valider
            {status === "executing" && <Loader />}
          </Button>
        </form>
      </Form>

      <div className="mt-5 flex items-center justify-center text-sm">
        <Button variant="link" asChild className="px-0 pl-1 font-normal">
          <Link href="login">Se connecter</Link>
        </Button>
      </div>
    </>
  );
}

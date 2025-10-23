"use client";

import { z } from "zod";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircleIcon, Eye, EyeOff, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { resetPasswordAction, sendNewOtpAction } from "./actions";
import { Loader } from "@/components/ui/loader";
import { NewPasswordSchema } from "./schema";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

type NewPasswordFormInput = z.input<typeof NewPasswordSchema>;

function NewPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState(false);
  const [isConfirmPasswordDisplayed, setIsConfirmPasswordDisplayed] =
    useState(false);

  const form = useForm<NewPasswordFormInput>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    execute,
    status,
    result: resultResetPasswordAction,
  } = useAction(resetPasswordAction, {
    onSuccess: ({ data }) => {
      toast.success(data?.message, { position: "bottom-right" });
      router.replace("/auth/login");
    },
  });

  const {
    execute: executeSendNewOtpAction,
    status: statusSendNewOtpAction,
    result: resultSendNewOtpAction,
  } = useAction(sendNewOtpAction);

  const isSubmitting =
    status === "executing" || statusSendNewOtpAction === "executing";

  const onSubmit = async (values: NewPasswordFormInput) => {
    execute(values);
  };

  const toggleShowPassword = () => {
    setIsPasswordDisplayed((prevState) => !prevState);
  };

  const toggleShowConfirmPassword = () => {
    setIsConfirmPasswordDisplayed((prevState) => !prevState);
  };

  const sendNewOtp = () => {
    if (email) executeSendNewOtpAction(email);
  };

  useEffect(() => {
    if (!email) {
      router.push("login");
    }
  }, [email]);

  const errorMsg =
    resultResetPasswordAction.serverError || resultSendNewOtpAction.serverError;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mt-6 grid gap-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code OTP</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={4}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup className="flex w-full justify-center">
                        <InputOTPSlot index={0} className="flex-1" />
                        <InputOTPSlot index={1} className="flex-1" />
                        <InputOTPSlot index={2} className="flex-1" />
                        <InputOTPSlot index={3} className="flex-1" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        onClick={toggleShowPassword}
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer mot de passe</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        className="rounded-r-none"
                        placeholder="Mot de passe"
                        type={isConfirmPasswordDisplayed ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        className="rounded-l-none bg-slate-100"
                        onClick={toggleShowConfirmPassword}
                      >
                        {isConfirmPasswordDisplayed ? (
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
          </div>

          {errorMsg ? (
            <div className="my-2 flex items-center gap-x-2 rounded border border-red-200 bg-red-100 p-2 text-xs font-semibold text-red-500">
              <TriangleAlertIcon size={18} />
              <span>{errorMsg}</span>
            </div>
          ) : (
            <>
              {resultSendNewOtpAction.data ? (
                <div className="my-2 flex items-center gap-x-2 rounded border border-green-200 bg-green-100 p-2 text-xs font-semibold text-green-500">
                  <CheckCircleIcon size={18} />
                  <span>{resultSendNewOtpAction.data.message}</span>
                </div>
              ) : null}
            </>
          )}

          <Button
            disabled={isSubmitting}
            className="mt-10 flex w-full items-center"
            type="submit"
          >
            Valider
            {status === "executing" && <Loader />}
          </Button>
        </form>
      </Form>

      <Button
        variant="outline"
        className="mt-4 flex w-full items-center"
        disabled={isSubmitting}
        onClick={sendNewOtp}
      >
        Demander un nouveau code
        {statusSendNewOtpAction === "executing" && <Loader />}
      </Button>

      <div className="mt-5 flex items-center justify-center text-sm">
        <Button variant="link" asChild className="px-0 pl-1 font-normal">
          <Link href="/login">Se connecter.</Link>
        </Button>
      </div>
    </>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={null}>
      <NewPasswordForm />
    </Suspense>
  );
}

"use client";

import * as z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import { Button } from "@/components/ui/button";
import { CheckCircleIcon, TriangleAlertIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { sendNewOtpAction, verifyOtpAction } from "./actions";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  otp: z
    .string()
    .length(4, { message: "Le code OTP doit contenir 4 chiffres" })
    .regex(/^\d+$/, {
      message: "Le code OTP ne doit contenir que des chiffres",
    }),
});

type PropsType = {
  email: string;
};

export default function VerificationOtp({ email }: PropsType) {
  const router = useRouter();

  const {
    execute: executeVerifyOtpAction,
    status: statusVerifyOtpAction,
    result: resultVerifyOtpAction,
  } = useAction(verifyOtpAction, {
    onSuccess: () => {
      router.replace("/auth/login");
    },
  });

  const {
    execute: executeSendNewOtpAction,
    status: statusSendNewOtpAction,
    result: resultSendNewOtpAction,
  } = useAction(sendNewOtpAction);

  const isSubmitting =
    statusVerifyOtpAction === "executing" ||
    statusSendNewOtpAction === "executing";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
    disabled: isSubmitting,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    executeVerifyOtpAction(values.otp);
  };

  const errorMsg =
    resultVerifyOtpAction.serverError || resultSendNewOtpAction.serverError;

  useEffect(() => {
    if (!email) {
      router.push("login");
    }
  }, [email]);

  const sendNewOtp = () => {
    executeSendNewOtpAction(email);
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-md md:max-w-80">
      <CardHeader>
        <CardTitle>Vérification du code OTP</CardTitle>
        <CardDescription>
          Veuillez entrer le code à 4 chiffres que vous avez reçu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            {resultSendNewOtpAction.data ? (
              <div className="my-2 flex items-center gap-x-2 rounded border border-green-200 bg-green-100 p-2 text-xs font-semibold text-green-500">
                <CheckCircleIcon size={18} />
                <span>{resultSendNewOtpAction.data.message}</span>
              </div>
            ) : null}

            {errorMsg ? (
              <div className="my-2 flex items-center gap-x-2 rounded border border-red-200 bg-red-100 p-2 text-xs font-semibold text-red-500">
                <TriangleAlertIcon size={18} />
                <span>{errorMsg}</span>
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Vérifier le code
              {statusVerifyOtpAction === "executing" && <Loader />}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="flex w-full items-center"
          disabled={isSubmitting}
          onClick={sendNewOtp}
        >
          Demander un nouveau code
          {statusSendNewOtpAction === "executing" && <Loader />}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function LoadingVerificationOtp() {
  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <CardContent>
        <div className="flex flex-col space-y-3 py-4">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

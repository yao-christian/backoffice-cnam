"use client";

import { useSearchParams } from "next/navigation";

import VerificationOtp, { LoadingVerificationOtp } from "./form";

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    return <LoadingVerificationOtp />;
  }

  return <VerificationOtp email={email} />;
}

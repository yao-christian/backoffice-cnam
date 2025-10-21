"use client";

import { useState } from "react";
import type { ProfileUser } from "@/features/profile/profile.type";
import { UpdateProfile } from "./_update/form";
import { useAction } from "next-safe-action/hooks";
import { resetPassword } from "./profile.action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

type Props = { profile: ProfileUser };

export default function ProfileInfo({ profile }: Props) {
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
    profile.email;

  const avatarUrl =
    profile.photoUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff&size=128`;

  const sendEmailVerification = async () => {
    try {
      setSending(true);
      // Adapte cet endpoint à ta stack actuelle (tu as VerificationToken en DB)
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      });
      if (!res.ok)
        throw new Error("Impossible d'envoyer le lien de vérification");
      alert(`Un lien de vérification a été envoyé à ${profile.email}`);
    } catch (e: any) {
      alert(e?.message ?? "Échec de l'envoi");
    } finally {
      setSending(false);
    }
  };

  const { execute: executeResetPassword, status } = useAction(resetPassword, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success(data.message, { position: "bottom-right" });
        router.push(`/profile/new-password?email=${profile.email}`);
      }
    },
    onError: (error) => {
      toast.error(error.error.serverError, { position: "bottom-right" });
    },
  });

  const isSeller = profile.role.code === "SELLER";
  const isEmailVerified = Boolean(profile.emailVerified);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col items-center md:flex-row md:items-start">
        <div className="relative mb-4 md:mb-0 md:mr-6">
          <img
            src={avatarUrl}
            alt={fullName}
            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>

        <div className="flex-grow text-center md:text-left">
          <h2 className="mb-2 text-2xl font-semibold">{fullName}</h2>
          <p className="mb-4 text-gray-600">{profile.email}</p>

          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {/* Rôle */}
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              Rôle: {profile.role.name}
            </span>

            {/* Vérification email */}
            {isEmailVerified ? (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                Email vérifié
              </span>
            ) : (
              <>
                <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                  Email non vérifié
                </span>
                <button
                  onClick={sendEmailVerification}
                  className="font-semibold uppercase text-blue-600 hover:text-blue-800 disabled:text-blue-400"
                  disabled={sending}
                >
                  Vérifier {sending && <span>…</span>}
                </button>
              </>
            )}

            {/* Badge vendeur/administration */}
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
              {isSeller ? "Vendeur" : "Administration"}
            </span>
          </div>
        </div>
      </div>

      {/* Infos personnelles */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="mb-2 text-lg font-semibold">
            Informations personnelles
          </h3>
          <InfoRow
            label="Nom prénoms :"
            value={`${profile.lastName} ${profile.firstName ?? ""}`}
          />
          <InfoRow
            label="Numéro de téléphone :"
            value={profile.phoneNumber ?? "—"}
          />
          <InfoRow label="Email :" value={profile.email} />
        </div>

        {/* Bloc vendeur (si applicable) */}
        <div className="space-y-4">
          <h3 className="mb-2 text-lg font-semibold">Compte vendeur</h3>
          {isSeller && profile.seller ? (
            <>
              <InfoRow
                label="Code vendeur :"
                value={profile.seller.sellerCode}
              />
              <InfoRow
                label="Solde :"
                value={formatXof(profile.seller.balance)}
              />
              <InfoRow
                label="Point de vente :"
                value={profile.seller.hasPointOfSale ? "Oui" : "Non"}
              />
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Aucun compte vendeur associé.
            </p>
          )}
        </div>
      </div>

      <hr className="my-6" />

      <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            variant={"link"}
            onClick={() => executeResetPassword(profile.email)}
            disabled={status === "executing"}
            className="font-semibold text-blue-600 underline hover:text-blue-800"
          >
            Modifier le mot de passe
            {status === "executing" && <Loader />}
          </Button>
        </div>

        <div className="flex gap-2">
          <UpdateProfile profile={profile} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function formatXof(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(n);
}

"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useAlertDialogStore } from "@/components/global-alert-dialog/store";
import { CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Loader } from "@/components/ui/loader";

export function GlobalAlertDialog() {
  const {
    isOpen,
    title,
    content,
    closeAlert,
    isLoading,
    submit,
    isInput,
    successMessage,
    errorMessage,
    confirmAction,
  } = useAlertDialogStore();

  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    submit(input);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm text-gray-700">
            {title}
          </AlertDialogTitle>
          {isInput ? (
            <Textarea
              value={input}
              placeholder={content}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
            />
          ) : (
            <AlertDialogDescription>{content}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {successMessage ? (
          <Alert className="border border-green-500 text-green-500">
            <div className="flex items-center gap-2">
              <CheckCircle color="green" className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </div>
          </Alert>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </div>
          </Alert>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={closeAlert}>
            Fermer
          </AlertDialogCancel>

          {confirmAction ? (
            <AlertDialogAction disabled={isLoading} onClick={handleConfirm}>
              {errorMessage ? "Réessayer" : "Valider"}
              {isLoading && <Loader className="ml-2" size={20} />}
            </AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

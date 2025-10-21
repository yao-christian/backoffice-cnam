"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { useModalStore } from "@/components/global-modal/store";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "usehooks-ts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/ui/loader";

export function GlobalModal() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    isOpen,
    title,
    content,
    closeModal,
    isLoading,
    submit,
    successMessage,
    errorMessage,
    confirmAction,
    closeText,
    CloseButton,
    handleCloseModal,
  } = useModalStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    submit();
  };

  const handleClose = () => {
    if (isLoading) return;

    if (handleCloseModal) {
      handleCloseModal();
    } else {
      closeModal();
    }
  };

  const handleClose1 = () => {
    if (isLoading) return;
    closeModal();
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose1}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-gray-800">
              {title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(100vh-10rem)] px-4">
            <div className="px-1">
              {content}

              <div className="my-4">
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
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            {CloseButton ?? (
              <DialogClose disabled={isLoading}>
                <Button variant="outline" onClick={handleClose}>
                  {closeText}
                </Button>
              </DialogClose>
            )}

            {confirmAction ? (
              <Button disabled={isLoading} onClick={handleConfirm}>
                {errorMessage ? "Réessayer" : "Valider"}
                {isLoading && <Loader className="ml-2" size={20} />}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="bg-white">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-max-h-[calc(100vh-10rem)] px-4">
          <div className="px-2">
            {content}

            <div className="my-4">
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
            </div>
          </div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>

          {confirmAction ? (
            <Button disabled={isLoading} onClick={handleConfirm}>
              {errorMessage ? "Réessayer" : "Valider"}
              {isLoading && <Loader className="ml-2" size={20} />}
            </Button>
          ) : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

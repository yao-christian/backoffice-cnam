"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { PlusCircle } from "lucide-react";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

import { createDepositAction } from "./actions";

import { CreateDepositFormInputType, CreateDepositFormSchema } from "./schema";

import { useModalStore } from "@/components/global-modal/store";
import { toast } from "react-toastify";
import { CustomError } from "@/utils/errors";
import { useSellers } from "@/features/seller/seller.hook";
import { useBanks } from "@/features/bank/bank.hook";
import { Loader } from "@/components/ui/loader";

export function CreationDeposit() {
  const showModal = useModalStore.use.showModal();

  return (
    <Button
      className={clsx(buttonVariants(), "ml-auto")}
      onClick={() =>
        showModal({
          title: "Dépôt",
          content: <DepositForm />,
        })
      }
    >
      Faire un dépôt <PlusCircle className="ml-2 h-4 w-4" />
    </Button>
  );
}

const initialValues: CreateDepositFormInputType = {
  bankId: "",
  amount: "",
  slipNumber: "",
  sellerId: "",
  depositDate: "",
};

function DepositForm() {
  const setConfirmAction = useModalStore.use.setConfirmAction();
  const startLoading = useModalStore.use.startLoading();
  const stopLoading = useModalStore.use.stopLoading();
  const closeModal = useModalStore.use.closeModal();
  const { data: sellers } = useSellers();
  const { data: banks } = useBanks();

  const router = useRouter();

  const form = useForm<CreateDepositFormInputType>({
    resolver: zodResolver(CreateDepositFormSchema, {}, { raw: true }),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: CreateDepositFormInputType) => {
    const formData = new FormData();

    for (const field of Object.keys(values) as Array<keyof typeof values>) {
      if (field === "slipFile") {
        if (values.slipFile) {
          formData.append("slipFile", values.slipFile[0]);
        }
      } else {
        formData.append(field, `${values[field]}`);
      }
    }

    startLoading();

    try {
      await createDepositAction(formData);
      toast.success("Votre deposit a été ajouté avec succès");
      router.refresh();
      closeModal();
    } catch (error: any) {
      stopLoading();
      toast.error(error.message, { position: "bottom-right" });
    }
  };

  useEffect(() => {
    setConfirmAction(form.handleSubmit(onSubmit));
  }, [form.getValues, setConfirmAction]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Montant</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Montant"
                      {...field}
                      value={formatAmount(field.value || "")}
                      onChange={(e) => {
                        const rawValue = removeFormatting(e.target.value);
                        field.onChange(rawValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slipNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Numéro bordereau / chèque</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro bordereau" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sellerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Vendeur</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vendeur" />
                      </SelectTrigger>
                      <SelectContent>
                        {sellers?.map((seller) => (
                          <SelectItem key={seller.id} value={`${seller.id}`}>
                            {seller.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Banque</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Banque" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks?.map((bank) => (
                          <SelectItem key={bank.id} value={`${bank.id}`}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depositDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Date du dépôt</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slipFile"
              render={() => (
                <FormItem>
                  <FormLabel required>Preuve</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Photo"
                      {...form.register("slipFile")}
                    />
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

const formatAmount = (value: string) => {
  if (!value) return "";
  const numericValue = value.replace(/[^\d]/g, "");
  return new Intl.NumberFormat("fr-FR").format(Number(numericValue));
};

const removeFormatting = (value: string) => {
  return value.replace(/[^\d]/g, "");
};

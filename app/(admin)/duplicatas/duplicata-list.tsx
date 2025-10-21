"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, SearchIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import * as XLSX from "xlsx";

import { PaginatedData } from "@/components/utils/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { buttonVariants } from "@/components/ui/button";
import { Duplicata } from "@/features/duplicata/duplicata.type";
import { getDuplicatas } from "./requests";

interface PropsType {
  data: PaginatedData<Duplicata>;
}

export function DuplicataList({ data }: PropsType) {
  const [dataState, setDataState] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo<ColumnDef<Duplicata>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const d = row.original;
          // return formatDateWithHour(d.createdAt);
        },
      },
      {
        accessorKey: "transactionId",
        header: "Transaction",
        cell: ({ row }) => row.original.transactionId,
      },
      {
        accessorKey: "secuNumber",
        header: "Numéro Sécu",
        cell: ({ row }) => row.original.secuNumber,
      },
      {
        accessorKey: "paymentRef",
        header: "Référence Paiement",
        cell: ({ row }) => row.original.paymentRef,
      },
      {
        accessorKey: "walletName",
        header: "Wallet",
        cell: ({ row }) => row.original.walletName,
      },
      {
        accessorKey: "amount",
        header: "Montant",
        cell: ({ row }) => (
          <div className="flex items-center text-sm">
            {/* {formatAmount(row.original.amount)} */}
          </div>
        ),
      },
      {
        accessorKey: "paymentStatus",
        header: "Paiement",
        cell: ({ row }) => {
          const ok = row.original.paymentStatus;
          return (
            <span
              className={
                "inline-flex rounded-full px-2 py-0.5 text-xs " +
                (ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")
              }
            >
              {ok ? "Payé" : "Échoué"}
            </span>
          );
        },
      },
      {
        accessorKey: "delivered",
        header: "Livraison",
        cell: ({ row }) => {
          const d = row.original.delivered;
          return (
            <span
              className={
                "inline-flex rounded-full px-2 py-0.5 text-xs " +
                (d
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700")
              }
            >
              {d ? "Livré" : "Non livré"}
            </span>
          );
        },
      },
    ],
    [],
  );

  const { table, globalFilter } = useDataTable({
    columns,
    data: dataState.data,
    manualPagination: true,
    rowCount: dataState.meta.total,
    pageCount: dataState.meta.lastPage,
  });

  const {
    pagination: { pageIndex, pageSize },
  } = table.getState();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      const res = await getDuplicatas({
        page: pageIndex,
        perPage: pageSize,
      });

      setIsLoading(false);
      setDataState(res);
    };

    getData();
  }, [pageIndex, pageSize, data]);

  const downloadXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      dataState.data.map((n) => ({
        // Date: formatDateWithHour(n.createdAt),
        "Transaction ID": n.transactionId,
        "Numéro Sécu": n.secuNumber,
        "Réf. Paiement": n.paymentRef,
        Wallet: n.walletName,
        // "Montant (XOF)": formatAmount(n.amount),
        "Statut Paiement": n.paymentStatus ? "Payé" : "Échoué",
        Livraison: n.delivered ? "Livré" : "Non livré",
        "Wallet ID": n.walletId,
        Type: n.subscriberType === "I" ? "Individuel" : "Collectif",
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventes");
    XLSX.writeFile(workbook, "liste-ventes.xlsx");
  };

  return (
    <>
      <header className="mb-5 flex h-14 items-center justify-between rounded bg-white px-4 shadow">
        <div className="flex-grow items-center gap-4">
          <div className="flex w-full items-center gap-2 rounded border border-gray-100 bg-gray-50 px-2">
            <SearchIcon className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher..."
              value={globalFilter ?? ""}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value);
              }}
              className="border-0 shadow-none focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
        </div>
      </header>

      <Card className="p-5">
        <div className="items-center justify-between border-b border-gray-300 xl:flex xl:p-2">
          <div className="flex h-14 justify-between gap-2 xl:justify-end xl:gap-4">
            <button className={buttonVariants()} onClick={downloadXLSX}>
              Télécharger XLSX <Download className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
        <DataTable table={table} columns={columns} isLoading={isLoading} />
      </Card>
    </>
  );
}

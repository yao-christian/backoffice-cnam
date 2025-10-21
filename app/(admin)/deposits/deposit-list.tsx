"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, SearchIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import * as XLSX from "xlsx";

import { PaginatedData } from "@/components/utils/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getDeposits } from "./requests";
import { formatDateWithHour } from "@/lib/date";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { buttonVariants } from "@/components/ui/button";
import { formatAmount } from "@/lib/utils";
import { CreationDeposit } from "./_new/form";
import { Deposit } from "@/features/deposit/deposit.type";

interface PropsType {
  data: PaginatedData<Deposit>;
}

export function DepositList({ data }: PropsType) {
  const [dataState, setDataState] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo<ColumnDef<Deposit>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell({ row }) {
          const deposit = row.original;
          return formatDateWithHour(deposit.depositDate);
        },
      },
      {
        accessorKey: "amount",
        header: "Montant",
        cell: ({ row }) => {
          const deposit = row.original;
          return (
            <div className="flex items-center text-sm">
              {formatAmount(deposit.amount)}
            </div>
          );
        },
      },
      { accessorKey: "bank.name", header: "Banque" },
      { accessorKey: "sellerAccount.seller.lastName", header: "Vendeur" },
      {
        accessorKey: "amountBefore",
        header: "Solde avant",
        cell: ({ row }) => {
          const deposit = row.original;
          return (
            <div className="flex items-center text-sm">
              {formatAmount(deposit.amountBefore)}
            </div>
          );
        },
      },
      {
        id: "balanceAfter",
        header: "Solde après",
        cell: ({ row }) => {
          const deposit = row.original;
          return (
            <div className="flex items-center text-sm">
              {formatAmount(deposit.amountBefore + deposit.amount)}
            </div>
          );
        },
      },
      {
        id: "slip",
        header: "Bordereau",
        cell: ({ row }) => {
          const deposit = row.original;
          return (
            <div className="flex items-center">
              {deposit.slipNumber &&
              deposit.slipFileName &&
              deposit.slipFileUrl ? (
                <>
                  <span>{deposit.slipNumber}</span>
                  <span className="mx-2">|</span>
                  <a
                    href={deposit.slipFileUrl}
                    download
                    className="text-xs font-semibold uppercase text-blue-600 underline"
                    target="_blank"
                  >
                    Télécharger
                  </a>
                </>
              ) : (
                "---"
              )}
            </div>
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

      const res = await getDeposits({
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
      dataState.data.map((deposit) => ({
        Date: formatDateWithHour(deposit.amount),
        "Montant (XOF)": formatAmount(deposit.amount),
        Banque: deposit.bank,
        Vendeur: deposit.sellerAccount?.seller?.lastName,
        "Solde Avant": formatAmount(deposit.amountBefore),
        "Solde Après": formatAmount(deposit.amountBefore + deposit.amount),
        Bordereau: deposit.slipNumber,
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dépôts");
    XLSX.writeFile(workbook, "liste-depots.xlsx");
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
          <div className="h-14">{<CreationDeposit />}</div>

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

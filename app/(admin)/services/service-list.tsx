"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, SearchIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import * as XLSX from "xlsx";

import { PaginatedData } from "@/components/utils/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getServices } from "./requests";
import { formatDateWithHour } from "@/lib/date";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { buttonVariants } from "@/components/ui/button";
import { CreateService } from "./_new/form";
import { Service } from "@/features/service/service.type";
import { UpdateService } from "./_update/form";
import { ChangeServiceStatus } from "./_change-status";
import { Badge } from "@/components/ui/badge";
import { DeleteService } from "./_delete";

interface PropsType {
  data: PaginatedData<Service>;
}

export function ServiceList({ data }: PropsType) {
  const [dataState, setDataState] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo<ColumnDef<Service>[]>(
    () => [
      { accessorKey: "code", header: "Code" },
      { accessorKey: "name", header: "Nom" },
      {
        id: "prepaid",
        header: "Prepayé",
        enableHiding: false,
        cell: ({ row }) => {
          const service = row.original;
          return service.prepaid ? (
            <Badge>Prepayé</Badge>
          ) : (
            <Badge variant="secondary">Postpayé</Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const service = row.original;

          return (
            <div className="flex items-center gap-x-2">
              <UpdateService service={service} />
              <DeleteService service={service} />
              <ChangeServiceStatus service={service} />
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

      const res = await getServices({
        page: pageIndex,
        perPage: pageSize,
      });

      setIsLoading(false);
      setDataState(res);
    };

    getData();
  }, [pageIndex, pageSize, data]);

  // Fonction pour télécharger en XLSX
  const downloadXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      dataState.data.map((service) => ({
        Code: service.code,
        Nom: service.name,
        Prepayé: service.prepaid ? "Oui" : "Non",
        "Date de creation": formatDateWithHour(new Date(service.createdAt)),
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Liste des vendeurs 10 premiers vendeurs",
    );
    XLSX.writeFile(workbook, "liste-vendeur.xlsx");
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
          <div className="h-14">{<CreateService />}</div>

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

"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, SearchIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import * as XLSX from "xlsx";

import { PaginatedData } from "@/components/utils/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getClaims } from "./requests";
import { formatDateWithHour } from "@/lib/date";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { buttonVariants } from "@/components/ui/button";
import { Claim } from "@/features/claim/claim.type";
// import { UpdateClaim } from "./_update/form";
import { Badge } from "@/components/ui/badge";

interface PropsType {
  data: PaginatedData<Claim>;
}

export function ClaimList({ data }: PropsType) {
  const [dataState, setDataState] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusProps = (statusId: number | null | undefined) => {
    switch (statusId) {
      case 1:
        return { className: "bg-green-500 text-white" }; // Résolu / Actif
      case 0:
        return { className: "bg-yellow-500 text-white" }; // En cours
      case 2:
        return { className: "bg-red-500 text-white" }; // Rejeté / Clos KO
      default:
        return { variant: "secondary" as const };
    }
  };

  // Parse sécurisé pour tes utilitaires (qui attendent number | Date)
  const toDateSafe = (value?: string | null): Date | null => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const columns = useMemo<ColumnDef<Claim>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Référence",
        cell: ({ getValue }) => <span>{getValue<string>() ?? "—"}</span>,
      },
      {
        accessorKey: "number",
        header: "Numéro",
        cell: ({ getValue }) => <span>{getValue<string>() ?? "—"}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
          <span className="block max-w-[220px] truncate">
            {getValue<string>() ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "comment",
        header: "Commentaire",
        cell: ({ getValue }) => (
          <span className="block max-w-[260px] truncate">
            {getValue<string | null>() ?? "—"}
          </span>
        ),
      },
      {
        id: "status",
        header: "Statut",
        enableHiding: false,
        cell: ({ row }) => {
          const { statusId, statusLabel } = row.original;
          const props = getStatusProps(statusId);
          return <Badge {...props}>{statusLabel ?? "—"}</Badge>;
        },
      },
      {
        id: "pattern",
        header: "Motif",
        cell: ({ row }) => <span>{row.original.pattern?.libelle ?? "—"}</span>,
      },
      {
        accessorKey: "createdAt",
        header: "Créée le",
        cell: ({ getValue }) => {
          const d = toDateSafe(getValue<string | null>());
          return (
            <span>{d ? formatDateWithHour(d, "dd/MM/yyyy HH:mm") : "—"}</span>
          );
        },
      },
      // {
      //   id: "actions",
      //   header: "Actions",
      //   enableHiding: false,
      //   cell: ({ row }) => {
      //     const claim = row.original;
      //     return (
      //       <div className="flex items-center gap-x-2">
      //         <UpdateClaim Claim={claim} />
      //       </div>
      //     );
      //   },
      // },
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

      const res = await getClaims({
        page: pageIndex,
        perPage: pageSize,
      });

      setIsLoading(false);
      setDataState(res);
    };

    getData();
  }, [pageIndex, pageSize, data]);

  const downloadXLSX = () => {
    const headers = [
      "Référence",
      "Numéro",
      "Email",
      "Commentaire",
      "Statut",
      "Motif",
      "Plateforme",
      "Créée le",
    ] as const;

    const rows = dataState.data.map((c) => ({
      Référence: c.reference ?? "—",
      Numéro: c.number ?? "—",
      Email: c.email ?? "—",
      Commentaire: c.comment ?? "—",
      Statut:
        c.statusLabel ??
        (c.statusId === 1
          ? "Actif"
          : c.statusId === 0
            ? "En cours"
            : "Inactif"),
      Motif: c.pattern?.libelle ?? "—",
      Plateforme: c.platform?.name ?? "—",
      "Créée le": (() => {
        const d = toDateSafe(c.createdAt);
        return d ? formatDateWithHour(d, "dd/MM/yyyy HH:mm") : "—";
      })(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows, { header: [...headers] });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Réclamations");

    // (optionnel) largeur de colonnes lisible
    worksheet["!cols"] = [
      { wch: 14 }, // Référence
      { wch: 12 }, // Numéro
      { wch: 28 }, // Email
      { wch: 40 }, // Commentaire
      { wch: 10 }, // Statut
      { wch: 22 }, // Motif
      { wch: 22 }, // Plateforme
      { wch: 18 }, // Créée le
    ];

    XLSX.writeFile(workbook, "reclamations.xlsx");
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { PaginatedData } from "@/components/utils/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getClaimPatterns } from "./requests";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { ClaimPattern } from "@/features/claim-pattern/claim-pattern.type";
import { CreateClaimPattern } from "./_new/form";
import { UpdateClaimPattern } from "./_update/form";
import { formatDateWithHour } from "@/lib/date";
import { DeleteClaimPattern } from "./_delete";

interface PropsType {
  data: PaginatedData<ClaimPattern>;
}

export function ClaimPatternList({ data }: PropsType) {
  const [dataState, setDataState] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const statusMeta: Record<number, { label: string; className: string }> = {
    0: { label: "En cours", className: "bg-sky-500 text-white" }, // IN_PROGRESS
    1: { label: "En attente", className: "bg-amber-500 text-white" }, // PENDING
    2: { label: "Résolue", className: "bg-green-600 text-white" }, // RESOLVED
    3: { label: "Fermée", className: "bg-slate-400 text-white" }, // CLOSED
    7: { label: "Initiée", className: "bg-violet-500 text-white" }, // INITIATED
  };

  const toDateSafe = (value?: string | null): Date | null => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const columns = useMemo<ColumnDef<ClaimPattern>[]>(
    () => [
      {
        accessorKey: "label",
        header: "Libellé",
      },
      {
        accessorKey: "status",
        header: "Statut",
        enableHiding: false,
        cell: ({ row }) => {
          const s = row.original.status ?? undefined;
          if (s === undefined || !(s in statusMeta)) {
            return <Badge variant="secondary">—</Badge>;
          }
          const meta = statusMeta[s as keyof typeof statusMeta];
          return <Badge className={meta.className}>{meta.label}</Badge>;
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const claimPattern = row.original;

          const d = toDateSafe(claimPattern.createdAt);
          return (
            <span>{d ? formatDateWithHour(d, "dd/MM/yyyy HH:mm") : "—"}</span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const claimPattern = row.original;
          return (
            <div className="flex items-center gap-x-2">
              <UpdateClaimPattern claimPattern={claimPattern} />
              <DeleteClaimPattern claimPattern={claimPattern} />
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

      const res = await getClaimPatterns({
        page: pageIndex,
        perPage: pageSize,
      });

      setIsLoading(false);
      setDataState(res);
    };

    getData();
  }, [pageIndex, pageSize, data]);

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
          <div className="h-14">{<CreateClaimPattern />}</div>
        </div>
        <DataTable table={table} columns={columns} isLoading={isLoading} />
      </Card>
    </>
  );
}

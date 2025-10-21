"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { PaginatedData } from "@/components/utils/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getAudits } from "./requests";
import { formatDateWithHour } from "@/lib/date";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { AuditLog } from "@/features/audit/audit.type";

interface PropsType {
  data: PaginatedData<AuditLog>;
}

export function AuditList({ data }: PropsType) {
  const [dataState, setDataState] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo<ColumnDef<AuditLog>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell({ row }) {
          const audit = row.original;
          return formatDateWithHour(audit.timestamp);
        },
      },
      {
        accessorKey: "user",
        header: "Utilisateur",
        cell({ row }) {
          const audit = row.original;
          if (!audit.user) {
            return "Système";
          }

          return `${audit.user.firstName} ${audit.user.lastName}`;
        },
      },
      {
        accessorKey: "action",
        header: "Action",
      },
      {
        accessorKey: "description",
        header: "Description",
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

      const res = await getAudits({
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
          <div className="flex h-14 justify-between gap-2 xl:justify-end xl:gap-4">
            <h2 className="text-lg font-medium">Liste des audits</h2>
          </div>
        </div>

        <DataTable table={table} columns={columns} isLoading={isLoading} />
      </Card>
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { PaginatedData } from "@/components/utils/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getRoles } from "./requests";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/features/role/role.type";
import { CreateRole } from "./_new/form";
import { UpdateRole } from "./_update/form";

interface PropsType {
  data: PaginatedData<Role>;
}

export function RoleList({ data }: PropsType) {
  const [dataState, setDataState] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nom du rôle",
        cell: ({ getValue }) => <span>{getValue<string>() ?? "—"}</span>,
      },
      {
        accessorKey: "guardName",
        header: "Guard",
        cell: ({ getValue }) => <span>{getValue<string>() ?? "—"}</span>,
      },
      {
        accessorKey: "status",
        header: "Statut",
        enableHiding: false,
        cell: ({ row }) => {
          const status = row.original.status;
          return status === 1 ? (
            <Badge className="bg-green-500 text-white">Actif</Badge>
          ) : (
            <Badge variant="secondary">Inactif</Badge>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ getValue }) => (
          <span className="max-w-[200px] truncate">
            {getValue<string>() ?? "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const role = row.original;
          return (
            <div className="flex items-center gap-x-2">
              <UpdateRole role={role} />
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

      const res = await getRoles({
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
          <div className="h-14">{<CreateRole />}</div>
        </div>
        <DataTable table={table} columns={columns} isLoading={isLoading} />
      </Card>
    </>
  );
}

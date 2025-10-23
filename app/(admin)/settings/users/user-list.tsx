"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, SearchIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import * as XLSX from "xlsx";

import { PaginatedData } from "@/components/utils/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getUsers } from "./requests";
import { formatDateWithHour } from "@/lib/date";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { buttonVariants } from "@/components/ui/button";
import { CreateUser } from "./_new/form";
import { User } from "@/features/user/user.type";
import { UpdateUser } from "./_update/form";
import { Badge } from "@/components/ui/badge";
import { DeleteUser } from "./_delete";

interface PropsType {
  data: PaginatedData<User>;
}

export function UserList({ data }: PropsType) {
  const [dataState, setDataState] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => <span>{getValue<number>() ?? 0}</span>,
      },
      {
        accessorKey: "firstName",
        header: "Prénom",
        cell: ({ getValue }) => <span>{getValue<string>() ?? "—"}</span>,
      },
      {
        accessorKey: "lastName",
        header: "Nom",
        cell: ({ getValue }) => <span>{getValue<string>() ?? "—"}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
          <span className="max-w-[200px] truncate">
            {getValue<string>() ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Téléphone",
        cell: ({ getValue }) => <span>{getValue<string>() ?? "—"}</span>,
      },
      {
        accessorKey: "status",
        header: "Statut",
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original;
          return user.status === 1 ? (
            <Badge className="bg-green-500 text-white">Actif</Badge>
          ) : (
            <Badge variant="secondary">Inactif</Badge>
          );
        },
      },
      {
        accessorKey: "roles",
        header: "Rôle",
        cell: ({ row }) => {
          const roles = row.original.roles ?? [];
          return roles.length > 0 ? (
            <Badge>{roles[0]?.name ?? "—"}</Badge>
          ) : (
            <Badge variant="secondary">Aucun</Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex items-center gap-x-2">
              <UpdateUser user={user} />
              <DeleteUser user={user} />
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

      const res = await getUsers({
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
      dataState.data.map((user) => ({
        Nom: `${user.firstName ?? "—"} ${user.lastName ?? ""}`.trim(),
        Email: user.email ?? "—",
        Téléphone: user.phone ?? "—",
        Rôle: user.roles?.[0]?.name ?? "—",
        Statut: user.status === 1 ? "Actif" : "Inactif",
        "Date de création": user.createdAt
          ? formatDateWithHour(new Date(user.createdAt))
          : "—",
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
          <div className="h-14">{<CreateUser />}</div>

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

"use client";

import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTable,
} from "@tanstack/react-table";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader } from "./loader";
import { cn } from "@/lib/utils";

type DataTableProps<TData, TValue> = React.ComponentProps<"div"> & {
  columns: ColumnDef<TData, TValue>[];
  table: ReactTable<TData>;
  empty?: React.ReactNode;
  isLoading?: boolean;
};

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    className,
    columns,
    table,
    isLoading,
    empty = "Aucune donnée",
  } = props;

  const {
    pagination: { pageIndex, pageSize },
  } = table.getState();

  const renderPagination = () => {
    const paginationRange = [];
    const siblingCount = 1;

    const pageCount = table.getPageCount();

    let startPage = Math.max(2, pageIndex - siblingCount);
    let endPage = Math.min(pageCount - 1, pageIndex + siblingCount);

    if (pageIndex === 0) {
      endPage = Math.min(2 + siblingCount, pageCount - 1);
    }

    if (pageIndex === pageCount - 1) {
      startPage = Math.max(pageCount - 2 - siblingCount, 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationRange.push(i);
    }

    return (
      <div className="flex items-center justify-end space-x-2">
        <div className="flex items-center gap-4">
          <div className="whitespace-nowrap text-sm text-gray-700">
            Par page :{" "}
          </div>

          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Par page" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem
                  key={pageSize.toString()}
                  value={pageSize.toString()}
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => table.setPageIndex(0)}
                  href="#"
                  isActive={pageIndex === 0}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {pageIndex > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {paginationRange.map((page) => (
                <PaginationItem
                  key={page}
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  <PaginationLink href="#" isActive={pageIndex === page - 1}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {pageIndex < pageCount - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pageCount > 1 && (
                <PaginationItem
                  onClick={() => table.setPageIndex(pageCount - 1)}
                >
                  <PaginationLink
                    href="#"
                    isActive={pageIndex === pageCount - 1}
                  >
                    {pageCount}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("relative w-full overflow-x-auto", className)}>
      <div className="min-w-full p-2">
        <div className="my-2 overflow-x-auto bg-white">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup: any) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => {
                    const rowSpan = (header.column.columnDef.meta as any)
                      ?.rowSpan as number;

                    if (
                      !header.isPlaceholder &&
                      rowSpan !== undefined &&
                      header.id === header.column.id
                    ) {
                      return null;
                    }

                    return (
                      <TableHead
                        className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:px-6 lg:py-3"
                        key={header.id}
                        colSpan={header.colSpan}
                        rowSpan={rowSpan}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: any) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell
                        className="whitespace-nowrap px-4 py-2 text-sm text-gray-700 lg:px-6 lg:py-4"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 whitespace-nowrap px-4 py-2 text-center text-sm text-gray-700 lg:px-6 lg:py-4"
                  >
                    {empty}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">{renderPagination()}</div>
      </div>

      {isLoading ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Loader />
        </div>
      ) : null}
    </div>
  );
}

type UseDataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  manualPagination?: boolean;
  manualFiltering?: boolean;
  rowCount?: number;
  pageCount?: number;
};

export function useDataTable<TData, TValue>(
  props: UseDataTableProps<TData, TValue>,
) {
  const {
    data,
    columns,
    manualPagination = false,
    manualFiltering = false,
    rowCount,
    pageCount,
  } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    //Pagination
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination,
    rowCount,
    pageCount,

    // Filter
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    manualFiltering,
    filterFns: {},
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnFilters, globalFilter },
  });

  return { table, globalFilter };
}

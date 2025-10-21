export interface PaginationMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

type FormatPaginatedData<T> = {
  totalCount: number;
  totalPages: number;
  page: number;
  perPage: number;
  data: T[];
};

export function formatPaginatedData<T>(props: FormatPaginatedData<T>) {
  const { totalCount, totalPages, page, perPage, data } = props;

  const meta: PaginationMeta = {
    total: totalCount,
    lastPage: totalPages,
    currentPage: page,
    perPage: perPage,
    prev: page > 0 ? page : null,
    next: page < totalPages ? page : null,
  };

  const formattedData: PaginatedData<T> = {
    data,
    meta,
  };

  return formattedData;
}

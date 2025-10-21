export type DateRange = { from: Date; to: Date };

export type SellerDashboard = {
  profile: "SELLER";
  balance: number;
  totalAmount: number;
  salesCount: number;
  recentSales: Array<{
    id: string;
    ref: string;
    service: string;
    qty: number;
    amount: number;
    date: Date;
  }>;
  topServices: Array<{
    serviceId: string;
    _sum: { amount: number | null };
    _count: { _all: number };
  }>;
  timeseries: Array<{ day: string; total: number }>;
  period: DateRange;
};

export type AdminDashboard = {
  profile: "ADMIN";
  totalAmount: number;
  salesCount: number;
  topSellers: Array<{
    sellerId: string;
    _sum: { amount: number | null };
    _count: { _all: number };
  }>;
  topServices: Array<{
    serviceId: string;
    _sum: { amount: number | null };
    _count: { _all: number };
  }>;
  recentSales: Array<{
    id: string;
    ref: string;
    seller: string;
    service: string;
    amount: number;
    date: Date;
  }>;
  depositsPending: Array<{
    id: string;
    amount: number;
    depositDate: Date;
    seller: string;
    bank: string;
  }>;
  timeseries: Array<{ day: string; total: number }>;
  period: DateRange;
};

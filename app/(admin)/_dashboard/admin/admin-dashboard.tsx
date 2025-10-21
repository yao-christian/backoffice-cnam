import { Suspense } from "react";
import dynamic from "next/dynamic";

import {
  ArrowUpRight,
  Users2,
  BarChart3,
  LineChart,
  CircleDollarSign,
} from "lucide-react";

import { getAdminDashboard } from "@/features/dashboard/admin-dashboard.service";

// Client-only chart (Recharts) loaded dynamically to keep page a Server Component
const TimeSeriesChart = dynamic(() => import("./timeseries.client"), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-gray-100" />,
});

export default async function AdminDashboard() {
  const data = await getAdminDashboard();

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">
            Tableau de bord — Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Période: {new Date(data.period.from).toLocaleDateString()} →{" "}
            {new Date(data.period.to).toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard
          title="Chiffre d'affaires"
          value={formatXof(data.totalAmount)}
          icon={<CircleDollarSign className="h-5 w-5" />}
        />
        <KpiCard
          title="Nombre de ventes"
          value={data.salesCount.toLocaleString()}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <KpiCard
          title="Top vendeurs (5)"
          value={(data.topSellers?.length ?? 0).toString()}
          icon={<Users2 className="h-5 w-5" />}
        />
        <KpiCard
          title="Top services (5)"
          value={(data.topServices?.length ?? 0).toString()}
          icon={<LineChart className="h-5 w-5" />}
        />
      </section>

      {/* Time series */}
      <section className="grid grid-cols-1 gap-4 bg-white">
        <div className="rounded-2xl border p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Évolution des ventes</h2>
          </div>
          <Suspense>
            <TimeSeriesChart points={data.timeseries} />
          </Suspense>
        </div>
      </section>

      {/* Tables */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Top vendeurs">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2 pr-4">Vendeur</th>
                  <th className="py-2 pr-4">Ventes</th>
                  <th className="py-2 pr-4">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.topSellers?.map((s) => (
                  <tr key={s.sellerId}>
                    <td className="py-2 pr-4 font-medium">{s.sellerId}</td>
                    <td className="py-2 pr-4">{s._count._all}</td>
                    <td className="py-2 pr-4">
                      {formatXof(s._sum.amount ?? 0)}
                    </td>
                  </tr>
                ))}
                {(!data.topSellers || data.topSellers.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-500">
                      Aucune donnée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Top services">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2 pr-4">Service</th>
                  <th className="py-2 pr-4">Ventes</th>
                  <th className="py-2 pr-4">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.topServices?.map((s) => (
                  <tr key={s.serviceId}>
                    <td className="py-2 pr-4 font-medium">{s.serviceId}</td>
                    <td className="py-2 pr-4">{s._count._all}</td>
                    <td className="py-2 pr-4">
                      {formatXof(s._sum.amount ?? 0)}
                    </td>
                  </tr>
                ))}
                {(!data.topServices || data.topServices.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-500">
                      Aucune donnée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Dernières ventes">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2 pr-4">Réf.</th>
                  <th className="py-2 pr-4">Vendeur</th>
                  <th className="py-2 pr-4">Service</th>
                  <th className="py-2 pr-4">Montant</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.recentSales.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 pr-4 font-mono text-xs">{s.ref}</td>
                    <td className="py-2 pr-4">{s.seller}</td>
                    <td className="py-2 pr-4">{s.service}</td>
                    <td className="py-2 pr-4">{formatXof(s.amount)}</td>
                    <td className="py-2 pr-4">
                      {new Date(s.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {data.recentSales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      Aucune vente récente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Derniers dépôts">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">Vendeur</th>
                  <th className="py-2 pr-4">Banque</th>
                  <th className="py-2 pr-4">Montant</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.depositsPending.map((d) => (
                  <tr key={d.id}>
                    <td className="py-2 pr-4 font-mono text-xs">
                      {d.id.slice(0, 8)}
                    </td>
                    <td className="py-2 pr-4">{d.seller}</td>
                    <td className="py-2 pr-4">{d.bank}</td>
                    <td className="py-2 pr-4">{formatXof(d.amount)}</td>
                    <td className="py-2 pr-4">
                      {new Date(d.depositDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data.depositsPending.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      Aucun dépôt récent
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-gray-400">{icon}</span>
      </div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
        <ArrowUpRight className="h-4 w-4" /> Mise à jour en temps réel
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 text-base font-semibold">{title}</div>
      {children}
    </div>
  );
}

function formatXof(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(n);
}

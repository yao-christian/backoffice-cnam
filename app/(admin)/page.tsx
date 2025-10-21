import { PageTitleTwo } from "@/components/ui/page-tiles/page-title-two";
import PaymentNotifications from "./cotisations/page";
import Duplicatas from "./duplicatas/page";

export const revalidate = 0;

export default async function DashboardPage() {
  return (
    <div>
      <PageTitleTwo title={"Cotisations"} />
      <PaymentNotifications />

      <div className="h-10" />

      <PageTitleTwo title={"Duplicatas"} />
      <Duplicatas />
    </div>
  );
}

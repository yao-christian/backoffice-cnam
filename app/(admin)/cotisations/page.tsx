import { SaleList } from "./payment-notification-list";
import { getPaymentNotificationsWithPagination } from "@/features/payment-notification/payment-notification-list.service";

export default async function Page() {
  const data = await getPaymentNotificationsWithPagination({});
  return <SaleList data={data} />;
}

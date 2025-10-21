import { getDepositsWithPagination } from "@/features/deposit/deposit-list.service";
import { DepositList } from "./deposit-list";

export default async function Page() {
  const data = await getDepositsWithPagination({});
  return <DepositList data={data} />;
}

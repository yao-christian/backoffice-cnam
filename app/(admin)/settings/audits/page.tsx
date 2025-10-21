import { getAuditsWithPagination } from "@/features/audit/audit-list.service";
import { AuditList } from "./audit-list";

export default async function Page() {
  const data = await getAuditsWithPagination({});
  return <AuditList data={data} />;
}

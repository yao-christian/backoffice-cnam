import { ClaimList } from "./claim-list";
import { getClaimsWithPagination } from "@/features/claim/claim-list.service";

export default async function ClaimsPage() {
  const data = await getClaimsWithPagination({});
  return <ClaimList data={data} />;
}

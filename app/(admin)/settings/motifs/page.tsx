import { getClaimPatternsWithPagination } from "@/features/claim-pattern/claim-pattern-list.service";
import { ClaimPatternList } from "./claim-pattern-list";

export default async function RolesPage() {
  const data = await getClaimPatternsWithPagination({});
  return <ClaimPatternList data={data} />;
}

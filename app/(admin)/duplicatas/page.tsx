import { getDuplicatasWithPagination } from "@/features/duplicata/duplicata-list.service";
import { DuplicataList } from "./duplicata-list";

export default async function Page() {
  const data = await getDuplicatasWithPagination({});
  return <DuplicataList data={data} />;
}

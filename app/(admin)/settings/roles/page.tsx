import { RoleList } from "./role-list";
import { getRolesWithPagination } from "@/features/role/role-list.service";

export default async function RolesPage() {
  const data = await getRolesWithPagination({});
  return <RoleList data={data} />;
}

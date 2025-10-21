import { UserList } from "./user-list";
import { getUsersWithPagination } from "@/features/user/user-list.service";

export default async function UsersPage() {
  const data = await getUsersWithPagination({});
  return <UserList data={data} />;
}

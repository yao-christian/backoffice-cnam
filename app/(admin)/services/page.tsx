import { getServicesWithPagination } from "@/features/service/service-list.service";
import { ServiceList } from "./service-list";

export default async function ServicesPage() {
  const data = await getServicesWithPagination({});

  return (
    <>
      <ServiceList data={data} />
    </>
  );
}

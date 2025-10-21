import { PageTitleTwo } from "@/components/ui/page-tiles/page-title-two";
import { Skeleton } from "@/components/ui/skeleton";

type PropsType = {
  title: string;
};

export default function ContentLoadingPage({ title }: PropsType) {
  return (
    <div className="w-full">
      <PageTitleTwo title={title} />
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

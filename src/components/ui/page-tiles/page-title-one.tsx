import Link from "next/link";

type PropsType = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  backUrl: string;
};

export default function PageTitleOne({
  title,
  backUrl,
  ...restProps
}: PropsType) {
  return (
    <div {...restProps}>
      <div className="flex items-center space-x-2 text-gray-600">
        <Link href={backUrl}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fill-rule="evenodd"
              d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="text-sm">{title}</h1>
      </div>
    </div>
  );
}

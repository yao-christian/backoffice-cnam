type PropsType = {
  title: string;
  button?: React.ReactNode;
};

export function PageTitleTwo({ title, button }: PropsType) {
  return (
    <header className="flex items-center justify-between h-14 rounded bg-white px-4 mb-5 shadow">
      <h1 className="uppercase font-bold">{title}</h1>
      {button}
    </header>
  );
}

export default function Container({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border w-full border-stone-200 bg-white px-3">{children}</div>;
}

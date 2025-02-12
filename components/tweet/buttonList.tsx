export default function ButtonList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-1 *:basis-full *:rounded-md *:p-1 *:text-center">
      {children}
    </div>
  );
}

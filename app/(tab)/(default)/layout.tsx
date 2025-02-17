export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-screen-sm pb-12 sm:pb-16">{children}</div>;
}

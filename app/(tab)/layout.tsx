import Link from "next/link";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-bold">
          Moments
        </Link>
        <Link href="/profile">MY</Link>
      </nav>
      <main className="mx-auto max-w-screen-sm px-4">{children}</main>
    </>
  );
}

import Logo from "@/components/logo";
import Link from "next/link";

export default function TabLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <>
      {modal}
      <nav className="flex items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <Link href="/profile">MY</Link>
      </nav>
      <main className="mx-auto max-w-screen-sm px-4">{children}</main>
    </>
  );
}

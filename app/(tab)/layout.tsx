import Logo from "@/components/logo";
import Link from "next/link";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col px-4">
      <header className="flex items-center justify-between py-3">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <Link href="/profile">MY</Link>
      </header>
      <div className="flex h-full w-full grow flex-col">{children}</div>
    </div>
  );
}

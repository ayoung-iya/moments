import Logo from "@/components/logo";
import Image from "next/image";
import Link from "next/link";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <Link href="/profile">MY</Link>
      </nav>
      <main className="mx-auto max-w-screen-sm px-4">{children}</main>
      <footer className="mt-20 flex justify-between border-t py-10 text-stone-700">
        <div className="select-none italic">
          당신의 이야기를 기록하는 공간, <b>Moments.</b>
        </div>
        <a href="https://github.com/ayoung-iya/moments" target="_blank">
          <Image src="/github-mark.svg" width={20} height={20} alt="moment github" />
        </a>
      </footer>
    </>
  );
}

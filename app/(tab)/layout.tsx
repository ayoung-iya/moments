import Logo from "@/components/logo";
import Image from "next/image";
import Link from "next/link";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <Link href="/profile">MY</Link>
      </header>
      <main className="mx-auto w-full max-w-screen-sm grow px-4 pb-12 sm:pb-16">{children}</main>
      <footer className="shadow-t-border flex items-center justify-between px-4 py-7 text-stone-700 sm:py-10">
        <div className="select-none text-xs italic">
          당신의 이야기를 기록하는 공간, <br />
          <b>Moments.</b>
        </div>
        <a href="https://github.com/ayoung-iya/moments" target="_blank">
          <Image src="/github-mark.svg" width={20} height={20} alt="moment github" />
        </a>
      </footer>
    </div>
  );
}

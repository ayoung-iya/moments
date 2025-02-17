import Image from "next/image";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="mx-auto w-full max-w-screen-sm flex-1 pb-12 sm:pb-16">{children}</main>
      <footer className="mt-3 flex items-center justify-between py-7 text-stone-700 shadow-t-border sm:py-10">
        <div className="select-none text-xs italic">
          당신의 이야기를 기록하는 공간, <br />
          <b>Moments.</b>
        </div>
        <a href="https://github.com/ayoung-iya/moments" target="_blank">
          <Image src="/github-mark.svg" width={20} height={20} alt="moment github" />
        </a>
      </footer>
    </>
  );
}

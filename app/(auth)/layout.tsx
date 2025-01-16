import Logo from "@/components/logo";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto mt-12 max-w-screen-sm px-3">
        <Link href="/" className="mb-10 block w-full text-center sm:mb-12">
          <Logo size="lg" />
        </Link>
        {children}
      </div>
    </>
  );
}

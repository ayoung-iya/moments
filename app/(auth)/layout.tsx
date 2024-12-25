import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto mt-12 max-w-screen-sm px-3">
        <Link
          href="/"
          className="mb-10 block w-full text-center text-5xl font-bold sm:mb-12"
        >
          Moments
        </Link>
        {children}
      </div>
    </>
  );
}

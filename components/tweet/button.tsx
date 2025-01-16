import Link from "next/link";
import { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";

type ButtonProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T> &
  PropsWithChildren;

export default function Button<T extends ElementType>({ as, children, ...props }: ButtonProps<T>) {
  const Element = as === "a" ? Link : "button";

  return <Element {...props}>{children}</Element>;
}

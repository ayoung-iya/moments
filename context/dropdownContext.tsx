"use client";

import { createContext, MouseEventHandler, ReactNode, RefObject, useEffect, useRef, useState } from "react";

interface DropdownContext {
  ref: RefObject<any>;
  openId: number | null;
  openDropdown: <T extends HTMLElement = HTMLButtonElement>(id: number) => MouseEventHandler<T>;
  closeDropdown: () => void;
  toggleDropdown: <T extends HTMLElement = HTMLButtonElement>(id: number) => MouseEventHandler<T>;
}

export const DropdownContext = createContext<DropdownContext>({
  ref: { current: null },
  openId: null,
  openDropdown: () => () => {},
  closeDropdown: () => {},
  toggleDropdown: () => () => {},
});

export default function DropdownProvider<T extends HTMLElement = HTMLDivElement>({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef<T>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  const openDropdown =
    <T extends HTMLElement = HTMLButtonElement>(id: number): MouseEventHandler<T> =>
    (e) => {
      e.stopPropagation();
      setOpenId(id);
    };
  const closeDropdown = () => {
    setOpenId(null);
  };
  const toggleDropdown =
    <T extends HTMLElement = HTMLButtonElement>(id: number): MouseEventHandler<T> =>
    (e) => {
      e.stopPropagation();
      if (id === openId) {
        closeDropdown();
        return;
      }

      openDropdown<T>(id)(e);
    };

  useEffect(() => {
    if (!(openId && ref.current)) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      if (!(openId && ref.current)) {
        return;
      }

      if (ref.current.contains(e.target as Node)) {
        return;
      }

      closeDropdown();
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [openId]);

  return (
    <DropdownContext.Provider value={{ ref, openId, openDropdown, closeDropdown, toggleDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
}

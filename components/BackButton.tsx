"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button className={pathname === "/" || pathname === "/login" ? "hidden" : "block mb-5 border-b border-b-transparent hover:border-b-black"} type="button" onClick={() => router.back()}>
      Back
    </button>
  );
}

"use client";

import { UsageSocketListener } from "@/components/UsageSocketListener";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UsageSocketListener />
      {children}
    </>
  );
}

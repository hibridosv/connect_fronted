'use client';

import { LoadingPage } from "@/components/LoadingPage";
import { NavbarPayments } from "@/components/NavbarPayments";
import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavbarPayments />
      <div className="w-full h-full">
        <Suspense fallback={<LoadingPage />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export default Layout;


'use client'

import { LoadingPage } from "@/components/LoadingPage";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="w-full h-full">
        <Suspense fallback={<LoadingPage />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export default Layout;

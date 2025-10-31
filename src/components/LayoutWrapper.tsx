"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({children}: { children: React.ReactNode;}) 
{
  const pathname = usePathname(); // use for getting pathname
  const hideLayout = pathname === "/login";

  // check if page is login or not if login then render without header
  if (hideLayout) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        {children}
      </main>
    );
  }

  // this return when its not login page with header and footer
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-[#F8F8F8]">
      {/* header imported */}
      <Header />
        <main className="flex-1 overflow-y-auto container mx-auto mt-4 mb-4 bg-white opacity-100 gap-6 rounded-lg w-full max-w-[1280px] h-auto">
          {children}
        </main>

      {/* footer imported */}
      <Footer />
    </div>
  );
}

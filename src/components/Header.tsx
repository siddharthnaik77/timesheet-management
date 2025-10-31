"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter(); 

  return (
    <header className="bg-white text-black py-4 shadow-md">
      <div className=" mx-auto flex justify-between  ">
        
        {/* Logo section */}
        <div  onClick={() => router.push("/dashboard")} className="w-[94px] h-[36px] flex items-center gap-[12px] px-4">
          <h1 className="text-xl font-bold text-black cursor-pointer">ticktock</h1>
        </div>

        {/* Timeline label */}
        <div className="relative py-4 w-[1100.5px] h-[21px] flex items-center gap-[32px] hidden sm:flex">
          <p className="text-black text-base font-medium">TimeLine</p>
        </div>

        {/* Right: User Dropdown to logout */}
        <div className="relative w-[200px] flex justify-end px-4">
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
              >
                <span>{session.user.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 h-4 transition-transform ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-10">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Not logged in</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

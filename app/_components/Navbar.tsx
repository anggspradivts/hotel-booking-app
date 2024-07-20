"use client";

import UserAvatar from "@/components/user-avatar";
import axios from "axios";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navRoute = [
    { name: "Stays", route: "/" },
    { name: "Flights", route: "/flights" },
    { name: "Test" },
  ];

  return (
    <div
      className={clsx(
        "bg-green-600 text-white px-28 p-1",
        "grid grid-cols-1 h-24",
        ""
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex">
          <p>Logo</p>
        </div>
        <div className="flex">
          <UserAvatar />
        </div>
      </div>
      <div className="flex items-center justify-between">
        {!pathname.startsWith("/partner") && (
          <>
            <div className="space-x-3">
              {navRoute.map((route, index) => (
                <button
                  className={clsx("px-2", "border border-white rounded-full")}
                >
                  {route.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => router.push("/partner")}
              className={clsx(
                "hover:bg-black hover:bg-opacity-10",
                "p-1 rounded"
              )}
            >
              List your property
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;

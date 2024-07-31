"use client";

import UserAvatar from "@/components/user-avatar";
import axios from "axios";
import clsx from "clsx";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [fullUrl, setFullUrl] = useState<string[]>([]);

  useEffect(() => {
    const urls = pathname.split("/").filter((segment) => segment !== "");
    setFullUrl(urls);
  }, [pathname]);

  const navRoute = [
    { name: "Stays", route: "/" },
    { name: "Flights", route: "/flights" },
    { name: "Test" },
  ];

  const generatePath = (index: number) => {
    return `/${fullUrl.slice(0, index + 1).join("/")}`;
  };

  return (
    <div>
      <div
        className={clsx(
          "bg-indigo-600 text-white md:px-28 p-1",
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
                    key={index}
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
      <div className="bg-white h-10 shadow-2xl md:px-28 flex items-center">
        <ul className="flex space-x-2 ">
          <li className="flex items-center hover:text-green-600">
            <Link href="/">
              <Home className="h-5 w-5" />{" "}
            </Link>
            {">"}
          </li>
          {fullUrl.map((url, index) => (
            <li key={index} className="hover:text-green-600">
              <Link href={generatePath(index)}>
                {url} {index < fullUrl.length - 1 && ">"}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserAvatar from "@/components/user-avatar";
import clsx from "clsx";
import { AlignJustify, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [fullUrl, setFullUrl] = useState<string[]>([]);

  useEffect(() => {
    const urls = pathname.split("/").filter((segment) => segment !== "");
    setFullUrl(urls);
  }, [pathname]);

  const generatePath = (index: number) => {
    return `/${fullUrl.slice(0, index + 1).join("/")}`;
  };

  return (
    <div>
      <div
        className={clsx(
          "bg-indigo-500 text-white md:px-28 p-1",
          "grid grid-cols-1 h-24",
          ""
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex">
            <p className="font-semibold">Hotel Booking</p>
          </div>
          <div className="flex space-x-5">
            <UserAvatar />
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger className="flex justify-center items-center">
                  <AlignJustify className="h-8 w-8" />
                </SheetTrigger>
                <SheetContent side={"bottom"} className="h-screen">
                  <ul className="my-5 flex flex-col">
                    <SheetClose>
                      <li
                        onClick={() => router.push("/partner")}
                        className="text-start p-3 bg-slate-100 w-full"
                      >
                        List your property
                      </li>
                    </SheetClose>
                  </ul>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-between">
          {!pathname.startsWith("/partner") && (
            <button
              onClick={() => router.push("/partner")}
              className={clsx(
                "hover:bg-black hover:bg-opacity-10",
                "p-1 rounded"
              )}
            >
              List your property
            </button>
          )}
        </div>
      </div>
      <div className="bg-white h-10 border-b border-slate-300 md:px-28 flex items-center">
        <ul className="flex space-x-2">
          <li className="flex items-center space-x-1 hover:text-green-600">
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

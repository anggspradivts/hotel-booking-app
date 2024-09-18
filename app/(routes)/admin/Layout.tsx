"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const layoutSidebarActions = [
    {
      name: "Dashboard",
      link: "/admin",
    },
    {
      name: "Manage Property",
      link: "/admin/manage-property",
    },
    {
      name: "Manage Users",
      link: "/admin/manage-user",
    },
  ];

  return (
    <div className="grid grid-cols-5 h-screen">
      <div className="col-span-1 bg-slate-100 border-r border-slate-400">
        <h1 className="text-center font-bold text-2xl p-3">Admin Page</h1>
        <ul className="flex flex-col space-y-1">
          {layoutSidebarActions.map((action, index) => (
            <li
              className={clsx("p-3 font-semibold", {
                "bg-indigo-200": pathname === action.link,
              })}
              key={index}
            >
              <Link className="w-full" href={action.link}>
                {action.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-4 p-1">{children}</div>
    </div>
  );
};

export default AdminLayout;

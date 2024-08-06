"use client"

import { db } from "@/lib/db";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();
  return (
    <div className="md:px-28 space-y-5">
      <div className="py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Welcome to admin page</h1>
      </div>
      <div>
        <button onClick={() => router.push("/admin/manage-property")} className="px-2 py-1 bg-slate-300 rounded-full">
          manage properties
        </button>
        <button onClick={() => router.push("/admin/manage-user")} className="px-2 py-1 bg-slate-300 rounded-full">
          manage users
        </button>
      </div>
    </div>
  );
};

export default AdminPage;

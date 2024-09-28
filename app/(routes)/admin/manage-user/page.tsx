"use server"
import { db } from "@/lib/db";
import AdminLayout from "../Layout";

const page = async () => {
  const getUsers = await db.user.findMany();

  return (
    <AdminLayout>
      Test
    </AdminLayout>
  );
};

export default page;
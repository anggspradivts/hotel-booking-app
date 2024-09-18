
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import AdminLayout from "../Layout";

const page = async () => {
  const getUsers = await db.user.findMany()

  return (
    <AdminLayout>
      Test
    </AdminLayout>
  );
};

export default page;
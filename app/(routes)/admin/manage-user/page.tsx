
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import toast from "react-hot-toast";

const page = async () => {
  const getUsers = await db.user.findMany()

  return (
    <div>

    </div>
  );
};

export default page;
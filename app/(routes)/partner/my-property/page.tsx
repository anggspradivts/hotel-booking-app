import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MyPropertyPage from "./MyPropertyPage";

const Page = async () => {
  const reqHeaders = headers();
  const user = await fetchUserServer(reqHeaders);

  if (!user) {
    return redirect("/sign-in");
  }

  const myProperty = await db.property.findMany({
    where: {
      OwnerId: user.userId,
    },
    include: {
      LocationDetails: true,
      MainImage: true,
    },
  });

  if (!myProperty) {
    return;
  }

  return (
    <div className="md:mx-28">
      <MyPropertyPage myProperty={myProperty} />
    </div>
  );
};

export default Page;

import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MyPropertyPage from "./MyPropertyPage";
import clsx from "clsx";

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
      MainImage: true
    }
  });

  if (!myProperty) {
    return;
  }

  return (
    <div className="md:mx-28">
      <div
        className={clsx(
          "flex items-center h-[60px]",
          "border-b border-slate-300"
        )}
      >
        <h1 className={clsx("text-lg font-semibold")}>My Properties</h1>
      </div>
      <div className="pt-6 flex space-x-5">
        <MyPropertyPage myProperty={myProperty} />
      </div>
    </div>
  );
};

export default Page;

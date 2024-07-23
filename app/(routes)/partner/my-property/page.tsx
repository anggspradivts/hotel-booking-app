import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const MyPropertyPage = async () => {
  const reqHeaders = headers();
  const user = await fetchUserServer(reqHeaders);

  if (!user) {
    return redirect("/sign-in")
  }

  const property = await db.property.findMany({
    where: {
      OwnerId: user.userId,
    },
  });

  return (
    <div className="md:mx-28">
      {property.map((prop) => (
        <div key={prop.id}>
          <Link href={`/partner/my-property/${prop.id}`}>
            <h1>{prop.name}</h1>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MyPropertyPage;

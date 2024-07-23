import { fetchUserServer } from "@/utils/user";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PropertyIdPage from "./PropertyIdPage";

const page = async ({
  params,
}: {
  params: { propertyId: string };
}) => {
  const { propertyId } = params;

  const reqHeaders = headers()
  const user = await fetchUserServer(reqHeaders);

  if (!user) {
    return redirect("/sign-in");
  }

  const property = await db.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    return <div>No property found</div>;
  }

  if (user.userId !== property.OwnerId) {
    return <div>You are not the owner of this property</div>;
  }

  return (
    <div className="md:mx-28">
      <PropertyIdPage />
    </div>
  );
};

export default page;

import { fetchUserServer } from "@/utils/user";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PropertyNameForm from "./_components/property-name";
import PropertyLocationForm from "./_components/property-location";

const page = async ({ params }: { params: { propertyId: string } }) => {
  const { propertyId } = params;

  const reqHeaders = headers();
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

  const findPropertyLocation = await db.propertyLocation.findUnique({
    where: {
      propertyId: property.id,
    }
  });

  if (!findPropertyLocation) {
    return //handle 
  }

  if (user.userId !== property.OwnerId) {
    return <div>You are not the owner of this property</div>;
  }

  return (
    <div className="mx-10 md:mx-28">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="left-section">
          {/* main img sec */}
          {/* description sec */}
        </div>
        <div className="right-section">
          <PropertyNameForm property={property}/>
          <PropertyLocationForm property={property} propertyLocation={findPropertyLocation} />
          {/* type section */}
          {/* price section */}
        </div>
      </div>
      <div>{/* group of images section */}</div>
    </div>
  );
};

export default page;

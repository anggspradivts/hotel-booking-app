import { db } from "@/lib/db";
import { fetchUser } from "@/utils/user";

const PropertyIdPage = async ({ params }: { params: { propertyId: string } }) => {
  const { propertyId } = params;
  const { userId } = await fetchUser();

  const property = await db.property.findUnique({
    where: {
      id: propertyId
    }
  });

  if (!property) {
    return <div>No property found</div>
  };

  if (userId !== property.OwnerId) {
    return <div>You are not the owner of this property</div>
  };

  return ( 
    <div className="md:mx-28">
      {propertyId}
    </div>
   );
}

export default PropertyIdPage;
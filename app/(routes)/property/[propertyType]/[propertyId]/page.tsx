import { db } from "@/lib/db";
import PropertyIdPage from "./PropertyIdPage";
import ImageSecPage from "./_components/image-sec";
import DescriptionSecPage from "./_components/description-sec";

const page = async ({ params }: { params: { propertyId: string} }) => {
  const { propertyId } = params;

  const property = await db.property.findUnique({
    where: {
      id: propertyId
    }, 
    include: {
      Images: true,
      MainImage: true,
      LocationDetails: {
        where: {
          propertyId: propertyId
        }
      }
    }
  });

  if (!property) {
    return 
  }

  if (!property.confirmed) {
    
  }

  return ( 
    <div className="px-1 md:px-28 space-y-5">
      <ImageSecPage property={property}/>
      <DescriptionSecPage property={property} />
    </div>
   );
}
 
export default page;
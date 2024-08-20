import { db } from "@/lib/db";
import PropertyIdPage from "./PropertyIdPage";
import ImageSecPage from "./_components/image-sec";
import DescriptionSecPage from "./_components/description-sec";
import FacilitiesSecPage from "./_components/facilities-sec";
import RoomOptionSec from "./_components/roomoption-sec";

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
      },
      Facilities: {
        where: {
          propertyId: propertyId
        }
      },
      RoomOption: {
        where: {
          propertyId: propertyId
        },
        include: {
          RoomTypes: {
            include: {
              BedTypes: true,
              RoomFacilities: true
            }
          }
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
    <div className="px-1 md:px-28 space-y-20">
      <ImageSecPage property={property}/>
      <FacilitiesSecPage property={property} />
      <DescriptionSecPage property={property} />
      <RoomOptionSec property={property} />
    </div>
   );
}
 
export default page;
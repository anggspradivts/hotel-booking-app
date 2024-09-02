import { db } from "@/lib/db";
import BookPropertyIdPage from "./BookPropertyId";

const BookPropertyPage = async ({ params }: { params: { propertyId: string } }) => {
  const property = await db.property.findUnique({
    where: {
      id: params.propertyId,
    },
    include: {
      LocationDetails: {
        where: {
          propertyId: params.propertyId
        }
      },
      RoomOption: {
        where: {
          propertyId: params.propertyId
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

  return ( 
    <div className="mx-5 my-2 lg:mx-28">
      <BookPropertyIdPage property={property}  />
    </div>
   );
}
 
export default BookPropertyPage;
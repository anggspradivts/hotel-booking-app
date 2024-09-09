import { db } from "@/lib/db";
import BookPropertyIdPageLayout from "./Layout";
import UserDataFormPage from "./_components/user-data-form";

const BookPropertyPage = async ({
  params,
  children,
}: {
  params: { propertyId: string };
  children: React.ReactNode;
}) => {
  const property = await db.property.findUnique({
    where: {
      id: params.propertyId,
    },
    include: {
      LocationDetails: {
        where: {
          propertyId: params.propertyId,
        },
      },
      RoomOption: {
        where: {
          propertyId: params.propertyId,
        },
        include: {
          RoomTypes: {
            include: {
              BedTypes: true,
              RoomFacilities: true,
            },
          },
        },
      },
    },
  });
  if (!property) {
    return (
      <div>
        <h1>Property not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-5 my-2 lg:mx-28">
      <UserDataFormPage property={property} />
    </div>
  );
};

export default BookPropertyPage;

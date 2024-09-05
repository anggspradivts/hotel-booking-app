import { db } from "@/lib/db";
import BookPropertyIdPageLayout from "../Layout";
import PaymentSectionPage from "./_components/payment-section";

interface PaymentPageProps {
  params: { propertyId: string };
  children: React.ReactNode;
}
const PaymentPage = async ({ params }: PaymentPageProps) => {
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
    return <div>Property not found</div>;
  }
  return (
    <div className="mx-5 my-2 lg:mx-28">
      <BookPropertyIdPageLayout property={property}>
        <PaymentSectionPage />
      </BookPropertyIdPageLayout>
    </div>
  );
};

export default PaymentPage;

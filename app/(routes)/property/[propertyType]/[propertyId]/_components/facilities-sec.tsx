import { Property, PropertyMainFacilities } from "@prisma/client";

interface FacilitiesSecPageProps {
  property: Property & { Facilities: PropertyMainFacilities[] };
}
const FacilitiesSecPage = ({ property }: FacilitiesSecPageProps) => {
  const facilities = property?.Facilities?.map((facility) => facility) || "";
  return (
    <div className="flex flex-col justify-center items-center space-y-5">
      <div className="text-center py-5 font-semibold text-lg">
        <h2>Property Main Facilities</h2>
      </div>
      <div className="flex flex-wrap space-x-3">
        {facilities?.length > 0 ? (
          facilities.map((facility) => (
            <p key={facility.id} className="p-2 mb-2 bg-slate-100 rounded-full">
              {facility.name}
            </p>
          ))
        ) : (
          <p>No facilities available</p>
        )}
      </div>
    </div>
  );
};

export default FacilitiesSecPage;

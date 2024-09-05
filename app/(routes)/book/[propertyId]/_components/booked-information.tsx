"use client";
import {
  BedTypes,
  Property,
  PropertyLocation,
  PropertyRoomOption,
  RoomTypes,
  RoomTypesFacilities,
} from "@prisma/client";
import { BedSingle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface BookedInformationPageProps {
  property: Property & {
    LocationDetails: PropertyLocation[];
    RoomOption: (PropertyRoomOption & {
      RoomTypes: (RoomTypes & {
        BedTypes: BedTypes[];
        RoomFacilities: RoomTypesFacilities[];
      })[];
    })[];
  };
  getCheckin: string | null;
  getCheckout: string | null;
  formattedCheckin: string | null;
  formattedCheckout: string | null;
  differenceInDays: number | null;
  // bookedRoom: RoomTypes & { RoomFacilities: RoomTypesFacilities[], BedTypes: BedTypes[] };
}
const BookedInformationPage = ({
  property,
  formattedCheckin,
  formattedCheckout,
  differenceInDays,
}: BookedInformationPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  if (!roomId) {
    return null;
  }

  const propertyLocation = property.LocationDetails[0];

  const mapRoomTypes = property.RoomOption.map((roomOpt) => roomOpt.RoomTypes);
  const findRoomType = mapRoomTypes.find((roomType) =>
    roomType.find((room) => room.id === roomId)
  );
  const bookedRoom = findRoomType ? findRoomType[0] : null;
  const roomPrice = bookedRoom?.price ? bookedRoom.price.toString() : "0";
  const totalCost = differenceInDays
    ? parseFloat(roomPrice) * differenceInDays
    : null;

  return (
    <div className="flex flex-col space-y-4">
      <div className="border border-indigo-100 rounded p-4">
        <h1 className="font-semibold text-lg">{property.name}</h1>
        <p>
          {propertyLocation.country}, {propertyLocation.county}
        </p>
      </div>
      <div className="border border-indigo-100 rounded p-4">
        {/* <h1 className="text-lg font-semibold">Schedule</h1> */}
        <div id="user-schedule" className="flex">
          <div className="flex flex-col border-r-2 border-slate-300 pr-3">
            <p className="text-lg font-semibold">Check-in:</p>{" "}
            <p>
              {formattedCheckin ? formattedCheckin : "No information provided"}
            </p>
          </div>
          <div className="flex flex-col border-l-2 border-slate-300 pl-3">
            <p className="text-lg font-semibold">Check-out:</p>{" "}
            <p>
              {formattedCheckout
                ? formattedCheckout
                : "No information provided"}
            </p>
          </div>
        </div>
        <div className="italic mt-3">
          <span className="font-semibold">
            {differenceInDays ? differenceInDays : "0"} nights
          </span>{" "}
          of stayed in
        </div>
      </div>
      <div className="border border-indigo-100 rounded p-4">
        <h1 className="text-lg font-semibold">Booked room details</h1>
        <div className="space-y-3">
          <p className="font-semibold flex space-x-2">
            <BedSingle />
            <span>{bookedRoom?.name}</span>
          </p>
          <div id="room-facilities">
            <p>facilities: </p>
            <p className="italic">
              {bookedRoom?.RoomFacilities.map((facility) => facility.name)}
            </p>
          </div>
          <div>
            <p>Bed types:</p>
            <p className="italic">
              {bookedRoom?.BedTypes.map((bed) => bed.name)}
            </p>
          </div>
          <div>
            <button
              onClick={() =>
                router.push(`/property/${property.PropertyType}/${property.id}`)
              }
              className="rounded hover:bg-white bg-indigo-100 p-2"
            >
              Change your selection
            </button>
          </div>
        </div>
      </div>
      <div className="border border-indigo-100 rounded p-4">
        <h1 className="text-lg font-semibold">Total Cost</h1>
        <p>original price {totalCost ? totalCost : "0"}$</p>
      </div>
    </div>
  );
};

export default BookedInformationPage;

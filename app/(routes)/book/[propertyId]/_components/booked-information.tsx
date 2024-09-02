"use client";
import {
  BedTypes,
  Property,
  PropertyLocation,
  PropertyRoomOption,
  RoomTypes,
  RoomTypesFacilities,
} from "@prisma/client";
import { Bed, BedSingle } from "lucide-react";

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
  roomId: string;
}
const BookedInformationPage = ({
  property,
  roomId,
}: BookedInformationPageProps) => {
  const propertyLocation = property.LocationDetails[0];
  const getUserSchedule = sessionStorage.getItem("user-schedule");
  type UserScheduleProps = {
    checkinDate: string;
    checkoutDate: string;
  };
  const userSchedule: UserScheduleProps = getUserSchedule
    ? JSON.parse(getUserSchedule)
    : null;
  const getCheckin = userSchedule ? userSchedule.checkinDate : null;
  const getCheckout = userSchedule ? userSchedule.checkoutDate : null;

  const checkin = getCheckin ? new Date(getCheckin) : null;
  const checkout = getCheckout ? new Date(getCheckout) : null;

  // Calculate the difference in time (milliseconds)
  const differenceInTime =
    checkin && checkout ? checkout.getTime() - checkin.getTime() : null;

  // Convert the difference from milliseconds to days
  const differenceInDays = differenceInTime
    ? differenceInTime / (1000 * 3600 * 24)
    : null;

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedCheckin = checkin
    ? new Intl.DateTimeFormat("en-US", options).format(checkin)
    : null;
  const formattedCheckout = checkout
    ? new Intl.DateTimeFormat("en-US", options).format(checkout)
    : null;

  const findRoomTypes = property.RoomOption.map((roomOpt) => roomOpt.RoomTypes);
  const findRoomType = findRoomTypes.find((roomType) =>
    roomType.find((room) => room.id === roomId)
  );
  const bookedRoom = findRoomType ? findRoomType[0] : null;
  const roomPrice = bookedRoom?.price?.toString()
  const totalCost = differenceInDays
    ? parseFloat(roomPrice ? roomPrice : "0") * differenceInDays
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
            <p>{formattedCheckin}</p>
          </div>
          <div className="flex flex-col border-l-2 border-slate-300 pl-3">
            <p className="text-lg font-semibold">Check-out:</p>{" "}
            <p>{formattedCheckout}</p>
          </div>
        </div>
        <div className="italic mt-3">
          <span className="font-semibold">{differenceInDays} nights</span> of
          stayed in
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
        </div>
      </div>
      <div className="border border-indigo-100 rounded p-4">
        <h1 className="text-lg font-semibold">Total Cost</h1>
        <p>original price {totalCost}$</p>
      </div>
    </div>
  );
};

export default BookedInformationPage;

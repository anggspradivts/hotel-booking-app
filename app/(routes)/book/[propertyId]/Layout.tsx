"use client";
import {
  BedTypes,
  Property,
  PropertyLocation,
  PropertyRoomOption,
  RoomTypes,
  RoomTypesFacilities,
} from "@prisma/client";
import { z } from "zod";
import BookedInformationPage from "./_components/booked-information";
import { useRouter, useSearchParams } from "next/navigation";
import "react-phone-input-2/lib/style.css"; // Import the CSS for the component
import React from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "Please fill in your first name"),
  lastName: z.string().min(1, "Please fill in your last name"),
  fullName: z.string().min(1, "Please fill in your full name"),
  email: z.string().min(1, "Please fill in your email address"),
  phoneNumber: z.string().min(1, "Please fill in your phone number"),
});

interface BookPropertyIdPageLayoutProps {
  property: Property & {
    LocationDetails: PropertyLocation[];
    RoomOption: (PropertyRoomOption & {
      RoomTypes: (RoomTypes & {
        BedTypes: BedTypes[];
        RoomFacilities: RoomTypesFacilities[];
      })[];
    })[];
  };
  children: React.ReactNode;
}
const BookPropertyIdPageLayout = ({
  property,
  children,
}: BookPropertyIdPageLayoutProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  if (!roomId) {
    return null;
  }

  const getUserSchedule = sessionStorage.getItem("user-schedule");
  if (!getUserSchedule) {
    router.push(`/property/${property.PropertyType}/${property.id}`);
  }
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

  type ChildProps ={
    property: Property
  }
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement<ChildProps>(child)) {
      return React.cloneElement(child, { property });
    }

    return child;
  }); 

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div>
        <BookedInformationPage
          property={property}
          getCheckin={getCheckin}
          getCheckout={getCheckout}
          formattedCheckin={formattedCheckin}
          formattedCheckout={formattedCheckout}
          differenceInDays={differenceInDays}
        />
      </div>
      <div>
        {enhancedChildren}
      </div>
    </div>
  );
};

export default BookPropertyIdPageLayout;
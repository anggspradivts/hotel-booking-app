"use client";
import axios from "axios";
import { Brush, BrushIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "path";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const BannerSec = () => {
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());

  const router = useRouter();

  //get session storage
  const getUserSchedule = sessionStorage.getItem("user-schedule");

  type UserScheduleProps = {
    checkinDate: string;
    checkoutDate: string;
  };
  const userSchedule: UserScheduleProps = getUserSchedule
    ? JSON.parse(getUserSchedule)
    : null;
  //the sessionStorage data is string, it should be Date | null
  const parsedCheckin = getUserSchedule
    ? new Date(userSchedule.checkinDate)
    : null;
  const parsedCheckout = getUserSchedule
    ? new Date(userSchedule.checkoutDate)
    : null;

  useEffect(() => {
    const setUserData = () => {
      if (parsedCheckin && parsedCheckout) {
        setCheckinDate(parsedCheckin);
        setCheckoutDate(parsedCheckout);
      }
    };
    setUserData();
  }, []);

  const setUserData = async (checkinDate: any, checkoutDate: any) => {
    try {
      const data = { checkinDate, checkoutDate };
      sessionStorage.setItem("user-schedule", JSON.stringify(data));
      toast.success("User schedule saved successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteUserData = () => {
    sessionStorage.clear();
    setCheckinDate(null);
    setCheckoutDate(null);
    router.refresh();
  };

  if (checkinDate && checkoutDate && !getUserSchedule) {
    setUserData(checkinDate, checkoutDate);
  }

  console.log("cc", checkinDate)

  return (
    <div className="container h-[500px]">
      <div
        style={{
          backgroundImage: `url("/hotel.jpeg")`,
          backgroundSize: "cover",
          backgroundColor: "rgba(0, 0, 0, 20)",
        }}
        className="h-full w-full"
      >
        <div className="w-full h-full space-y-3 flex flex-col justify-center items-center bg-black bg-opacity-20">
          <p className="text-3xl text-white font-semibold">
            The best accomodation you can find
          </p>
          <div className="flex justify-center space-x-5 ">
            <div className="flex flex-col">
              <h2 className="text-white font-semibold">Checkin date:</h2>
              <DatePicker
                showIcon
                selectsStart
                selected={checkinDate}
                startDate={checkinDate || undefined}
                endDate={checkoutDate || undefined}
                minDate={currentDate || undefined}
                placeholderText="checkin date"
                onChange={(date) => setCheckinDate(date)}
                className="border-2 border-black rounded w-full"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-white font-semibold">Checkout date:</h2>
              <DatePicker
                showIcon
                selectsEnd
                selected={checkoutDate}
                startDate={checkinDate || undefined}
                endDate={checkoutDate || undefined}
                minDate={checkinDate || undefined}
                placeholderText="checkout date"
                onChange={(date) => setCheckoutDate(date)}
                className="border-2 border-black rounded w-full"
              />
            </div>
            {checkinDate && checkoutDate && getUserSchedule && (
              <div className="">
                <div className="h-1/2"></div>
                <div
                  className="h-1/2 bg-white rounded p-1 flex justify-center"
                  onClick={deleteUserData}
                >
                  <X className="" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSec;

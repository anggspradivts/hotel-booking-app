"use client";
import axios from "axios";
import { Brush, BrushIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "path";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

type UserScheduleProps = {
  checkinDate: string;
  checkoutDate: string;
};
const BannerSec = () => {
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());
  const [userSchedule, setUserSchedule] = useState<UserScheduleProps>()
  const router = useRouter();

  const parsedCheckin = userSchedule
  ? new Date(userSchedule.checkinDate)
  : null;
  const parsedCheckout = userSchedule
  ? new Date(userSchedule.checkoutDate)
  : null;

  useEffect(() => {
    const getUserSchedule = sessionStorage.getItem("user-schedule");
    const userSchedule = getUserSchedule
      ? JSON.parse(getUserSchedule)
      : null;
    setUserSchedule(userSchedule);
  }, []);

  useEffect(() => {
    const setUserData = () => {
      if (parsedCheckin && parsedCheckout) {
        setCheckinDate(parsedCheckin);
        setCheckoutDate(parsedCheckout);
      }
    };
    setUserData();
  }, [userSchedule])

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

  if (checkinDate && checkoutDate && !userSchedule) {
    setUserData(checkinDate, checkoutDate);
  }

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
            {checkinDate && checkoutDate && userSchedule && (
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

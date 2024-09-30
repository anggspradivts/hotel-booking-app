"use client";
import clsx from "clsx";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const [currentDate] = useState<Date | null>(new Date());
  const [userSchedule, setUserSchedule] = useState<UserScheduleProps | null>(
    null
  );
  const router = useRouter();

  const parsedCheckin = userSchedule
    ? new Date(userSchedule.checkinDate)
    : null;
  const parsedCheckout = userSchedule
    ? new Date(userSchedule.checkoutDate)
    : null;
    
    //set user schedule
  useEffect(() => {
    const getUserSchedule = sessionStorage.getItem("user-schedule");
    const userSchedule = getUserSchedule ? JSON.parse(getUserSchedule) : null;
    setUserSchedule(userSchedule);
  }, []);

  //set user schedule when the component mounts and theres userschedule on sessionStorage
  useEffect(() => {
    const setUserData = () => {
      if (parsedCheckin && parsedCheckout) {
        setCheckinDate(parsedCheckin);
        setCheckoutDate(parsedCheckout);
      }
    };
    setUserData();
  }, [userSchedule]);

  //set user schedule session storage and
  const setUserData = async (checkinDate: any, checkoutDate: any) => {
    if (!userSchedule) {
      try {
        const data = { checkinDate, checkoutDate };
        // Ensure sessionStorage is only accessed in the browser
        if (typeof window !== "undefined") {
          sessionStorage.setItem("user-schedule", JSON.stringify(data));
        }
        setUserSchedule(data);
        toast.success("User schedule saved successfully");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong");
      }
    } else {
      toast.error("User schedule allready provided");
    }
  };

  // useEffect to trigger when dates change or userSchedule is not set
  useEffect(() => {
    if (checkinDate && checkoutDate && !userSchedule) {
      setUserData(checkinDate, checkoutDate);
    }
  }, [checkinDate, checkoutDate]);

  //
  const deleteUserData = () => {
    sessionStorage.clear();
    setCheckinDate(null);
    setCheckoutDate(null);
    setUserSchedule(null);
    router.refresh();
  };

  return (
    <div className="flex justify-center h-[300px] lg:h-[500px] w-screen">
      <div className="h-full w-full object-cover bg-indigo-500">
        <div
          className={clsx(
            "w-full h-full space-y-3 md:space-y-5 flex flex-col justify-center items-center"
          )}
        >
          <p className="text-center text-3xl text-white font-semibold">
            The best accomodation you can find
          </p>
          <div className="flex justify-center space-x-5 text-center md:text-start px-8">
            <div className="flex flex-col">
              <h2 className="text-white font-semibold">Checkin date:</h2>
              <DatePicker
                showIcon
                selectsStart
                selected={checkinDate ? checkinDate : currentDate}
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
          <p className="text-white font-semibold text-center">
            Manage your schedule and then choose a property
          </p>
        </div>
      </div>
    </div>
  );
};

export default BannerSec;

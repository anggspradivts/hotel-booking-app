"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

type UserScheduleProps = {
  checkinDate: string;
  checkoutDate: string;
};
const DatePickerPage = () => {
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());
  const [userSchedule, setUserSchedule] = useState<UserScheduleProps | null>(null)
  const router = useRouter();

  //the sessionStorage data is string, it should be Date | null
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
    setUserSchedule(userSchedule)
  }, []);

  useEffect(() => {
    const setUserData = () => {
      if (parsedCheckin && !isNaN(parsedCheckin.getTime()) && parsedCheckout && !isNaN(parsedCheckout.getTime())) {
        setCheckinDate(parsedCheckin);
        setCheckoutDate(parsedCheckout);
      }
    };
    setUserData();
  }, [userSchedule]);

  const setUserData = async (checkinDate: any, checkoutDate: any) => {
    try {
      if (!checkinDate || !checkoutDate) {
        toast.error("Both checkin and checkout date have to be filled")
      } else {
        const data = { checkinDate, checkoutDate };
        sessionStorage.setItem("user-schedule", JSON.stringify(data));
        if(sessionStorage.getItem("user-schedule")) {
          setUserSchedule(JSON.parse(sessionStorage.getItem("user-schedule")!));
          toast.success("Your schedule saved successfully");
          router.refresh();
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteUserData = () => {
    sessionStorage.clear();
    setCheckinDate(null);
    setCheckoutDate(null);
    setUserSchedule(null);
    router.refresh();
  };

  return (
    <div className="space-y-5 bg-indigo-400 px-5">
      <div className="flex justify-center items-center my-8">
        <h1 className="p-5 text-lg font-bold text-white">My Schedule</h1>
      </div>
      <div className="flex justify-center space-x-5 ">
        <div className="flex flex-col">
          <h2 className="text-white">Checkin date:</h2>
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
          <h2 className="text-white">Checkout date:</h2>
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
      </div>
      <div className="flex justify-center items-center">
        {userSchedule ? (
          <button
            onClick={deleteUserData}
            className="px-3 p-1 mb-5 rounded bg-slate-100 border-2 border-black"
          >
            Clear
          </button>
        ) : (
          <button
            onClick={() => setUserData(checkinDate, checkoutDate)}
            className="px-3 p-1 mb-5 rounded bg-slate-100"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default DatePickerPage;

"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const DatePickerPage = () => {
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());

  const router = useRouter();

  const getUserSchedule = sessionStorage.getItem("user-schedule");

  type UserScheduleProps = {
    formatCheckinDate: string;
    formatCheckoutDate: string;
  }
  const userSchedule: UserScheduleProps = getUserSchedule ? JSON.parse(getUserSchedule) : null
  //the sessionStorage data is string, it should be Date | null
  const parsedCheckin = getUserSchedule ? new Date(userSchedule.formatCheckoutDate) : null;
  const parsedCheckout = getUserSchedule ? new Date(userSchedule.formatCheckoutDate) : null;

  useEffect(() => {
    const setUserData = () => {
      console.log(parsedCheckin)
      if (parsedCheckin && parsedCheckout) {
        setCheckinDate(parsedCheckin);
        setCheckoutDate(parsedCheckout);
      }
    };
    setUserData();
  }, []);

  const setUserData = async (checkinDate: any, checkoutDate: any) => {
    try {
      const formatCheckinDate = checkinDate.toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
      const formatCheckoutDate = checkoutDate.toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
      const data = { formatCheckinDate, formatCheckoutDate }
      sessionStorage.setItem("user-schedule", JSON.stringify(data));
      // sessionStorage.setItem("checkout", formatCheckoutDate);
      toast.success("User data saved successfully");
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

  return (
    <div className="space-y-5 bg-indigo-400">
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
        {getUserSchedule ? (
          <button
            onClick={deleteUserData}
            className="px-3 p-1 mb-5 rounded bg-slate-100"
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

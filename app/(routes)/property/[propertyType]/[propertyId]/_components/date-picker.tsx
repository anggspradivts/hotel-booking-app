"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const DatePickerPage = () => {
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);

  const getCheckin = localStorage.getItem("checkin");
  const getCheckout = localStorage.getItem("checkout");

  useEffect(() => {
    const setUserData = () => {
      //the localStorage data is string, it should be Date | null
      const parsedChekin = getCheckin ? new Date(getCheckin) : null;
      const parsedChekout = getCheckout ? new Date(getCheckout) : null;
      if (parsedChekin && parsedChekout) {
        setCheckinDate(parsedChekin);
        setCheckoutDate(parsedChekout);
      }
    };
    setUserData();
  }, [checkinDate, checkoutDate]);

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
      const data = { formatCheckinDate, formatCheckoutDate };
      const response = await axios.post("/api/auth/user", data);
      if (response.status === 200) {
        const responseData = response.data.data;
        localStorage.setItem("checkin", responseData.formatCheckinDate);
        localStorage.setItem("checkout", responseData.formatCheckoutDate);
        toast.success("User data saved successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteUserData = () => {
    localStorage.clear();
    setCheckinDate(null);
  };

  return (
    <div className="space-y-5 bg-indigo-400">
      <div className="flex justify-center items-center my-8">
        <h1 className="p-5 text-lg font-bold text-white">
          Checkin and Checkout
        </h1>
      </div>
      <div className="flex justify-center space-x-5 ">
        <DatePicker
          showIcon
          isClearable
          selected={checkinDate}
          placeholderText="checkin date"
          onChange={(date) => setCheckinDate(date)}
          className="border-2 border-black rounded w-full"
        />
        <DatePicker
          showIcon
          isClearable
          selected={checkoutDate}
          placeholderText="checkout date"
          onChange={(date) => setCheckoutDate(date)}
          className="border-2 border-black rounded w-full"
        />
      </div>
      <div className="flex justify-center items-center">
        {getCheckin && getCheckout ? (
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

"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const BannerSec = () => {
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());

  const router = useRouter();

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
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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
        <div className="w-full h-full space-y-3 flex flex-col justify-center items-center">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSec;

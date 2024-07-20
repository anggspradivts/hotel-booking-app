"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PartnerLandingPage = () => {
  const [isPartner, setIsPartner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/user");
        const { role } = res.data;
        if (role === "PARTNER") {
          setIsPartner(true);
        }
      } catch (error) {
        console.log("Something went wrong");
      }
    };
    fetchUser();
  });

  const handleClick = async () => {
    try {
      const res = await axios.post("/api/partner-register");
      router.push("/partner/list-property");
      toast.success(res.data.message);
      setIsPartner(true);
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  return (
    <div className="px-28">
      Be a partner
      {isPartner ? (
        <button
          onClick={() => router.push("/partner/property-type")}
          className="p-1 bg-slate-200 rounded"
        >
          List a property
        </button>
      ) : (
        <button onClick={handleClick} className="p-1 bg-slate-200 rounded">
          Get started
        </button>
      )}
    </div>
  );
};

export default PartnerLandingPage;

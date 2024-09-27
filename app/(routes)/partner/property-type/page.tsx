"use client";

import { fetchUser } from "@/utils/user";
import axios from "axios";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PropertyTypePage = () => {
  const [user, setUser] = useState({
    id: "",
    username: "",
  });
  const [isShow, setIsShow] = useState<number | null>(null);

  const router = useRouter();

  const propertyType = [
    {
      id: 1,
      type: "hotel",
      name: "Hotel",
    },
    {
      id: 2,
      type: "villa",
      name: "Villa",
    },
    {
      id: 3,
      type: "appartment",
      name: "Appartment",
    },
  ];

  useEffect(() => {
    const getUser = async () => {
      try {
        const { name, userId } = await fetchUser();
        if (name) {
          setUser({ id: userId ? userId : "", username: name });
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        toast.error("/Something went wrong");
      }
    };
    getUser();
  }, [router]);

  const handleCreateProperty = async (propertyType: string, userId: string) => {
    try {
      const data = { propertyType, userId }; //Incoming data is plain text, format it into object
      const res = await axios.post("/api/partner/property/create", data);
      const createProperty = res.data.createProperty;
      router.push(`/partner/my-property/${createProperty.id}`);
      toast.success("Success creating property");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="md:px-28">
      <div className="flex justify-center items-center h-[200px]">
        <h1 className="text-4xl font-semibold text-center">
          What type is your <span className="text-indigo-600">property</span>
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {propertyType.map((prop) => (
          <div
            key={prop.id}
            onClick={() => handleCreateProperty(prop.type, user.id)}
          >
            <div className=" flex items-center justify-center h-[100px] md:h-[300px] group relative">
              <Image
                className={clsx(
                  "absolute inset-0 opacity-0 transition-opacity duration-500",
                  "group-hover:opacity-100",
                  "h-full w-full object-cover"
                )}
                src="/test.jpg"
                alt="example-img"
                layout="fill"
                onMouseEnter={() => setIsShow(prop.id)}
                onMouseLeave={() => setIsShow(null)}
              />
              <div
                className={clsx(
                  "flex justify-center items-center h-full w-full ",
                  "bg-slate-300 ",
                  "md:text-3xl font-semibold"
                )}
              >
                {prop.name}
              </div>
            </div>
            {isShow === prop.id && (
              <div className="text-center mt-8">
                <p className="md:text-3xl font-semibold">{prop.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyTypePage;

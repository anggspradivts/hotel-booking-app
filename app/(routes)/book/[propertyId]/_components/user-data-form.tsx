"use client";
import LoadingButton from "@/components/loading-btn";
import { zodResolver } from "@hookform/resolvers/zod";
import { BedTypes, Property, PropertyLocation, PropertyRoomOption, RoomTypes, RoomTypesFacilities } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "Please fill in your first name"),
  lastName: z.string().min(1, "Please fill in your last name"),
  fullName: z.string().min(1, "Please fill in your full name"),
  email: z.string().min(1, "Please fill in your email address"),
  phoneNumber: z.string().min(1, "Please fill in your phone number"),
});

interface UserDataFormPageProps {
  property: Property & {
    LocationDetails: PropertyLocation[];
    RoomOption: (PropertyRoomOption & {
      RoomTypes: (RoomTypes & {
        BedTypes: BedTypes[];
        RoomFacilities: RoomTypesFacilities[];
      })[];
    })[];
  };
}
const UserDataFormPage = ({ property }: UserDataFormPageProps) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false)
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
  const checkin = userSchedule ? new Date(userSchedule.checkinDate) : null;
  const checkout = userSchedule ? new Date(userSchedule.checkoutDate) : null;
  // Calculate the difference in time (milliseconds)
  const differenceInTime =
    checkin && checkout ? checkout.getTime() - checkin.getTime() : null;

  // Convert the difference from milliseconds to days
  const differenceInDays = differenceInTime
    ? differenceInTime / (1000 * 3600 * 24)
    : null;

  const mapRoomTypes = property.RoomOption.map((roomOpt) => roomOpt.RoomTypes);
  const findRoomType = mapRoomTypes.find((roomType) =>
    roomType.find((room) => room.id === roomId)
  );
  const bookedRoom = findRoomType ? findRoomType[0] : null;
  const roomPrice = bookedRoom?.price ? bookedRoom.price.toString() : "0";
  const totalCost = differenceInDays
    ? parseFloat(roomPrice) * differenceInDays
    : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  });
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const completeData = {
        ...data,
        roomId,
        checkin,
        checkout,
        totalCost,
        totalDays: differenceInDays,
        propertyId: property.id,
      };
      const res = await axios.post("/api/book", completeData);
      if (res.status === 200) {
        console.log(res.data);
        router.push(`/book/${completeData.propertyId}/payment?paymentId=${res.data.createUserBookData.id}&roomId=${roomId}`)
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false)
    }
  };
  return (
    <div>
      <div className="flex flex-col space-y-4 p-4 border border-indigo-100 rounded">
        <div className="flex justify-center items-center p-4 bg-indigo-100 rounded border-2 border-indigo-100">
          <p>Please fill the form</p>
        </div>
        <form className="space-y-4" {...form} onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-5">
            <div className="flex flex-col w-full">
              <label htmlFor="firstname">First Name</label>
              <input
                {...register("firstName")}
                type="text"
                id="firstname"
                defaultValue={getValues("firstName")}
                placeholder="your first name..."
                className={clsx(
                  "w-full px-3 py-2",
                  "border border-slate-300 rounded-lg",
                  { "border-red-500": errors.firstName }
                )}
              />
              {errors.firstName && (
                <span className="text-red-500">{errors.firstName.message}</span>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="lastname">Last Name</label>
              <input
                {...register("lastName")}
                type="text"
                id="lastname"
                defaultValue={getValues("lastName")}
                placeholder="your last name..."
                className={clsx(
                  "w-full px-3 py-2",
                  "border border-slate-300 rounded-lg",
                  { "border-red-500": errors.lastName }
                )}
              />
              {errors.lastName && (
                <span className="text-red-500">{errors.lastName.message}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="useremail">Email Address</label>
            <input
              {...register("email")}
              type="text"
              id="useremail"
              defaultValue={getValues("email")}
              placeholder="your email"
              className={clsx(
                "w-1/2 px-3 py-2",
                "border border-slate-300 rounded-lg",
                { "border-red-500": errors.email }
              )}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="phonenumber">Phone Number</label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country="id"
                  value={field.value}
                  placeholder="Enter your phone number"
                  onChange={(phone) => {
                    field.onChange(phone); // Update react-hook-form state
                    setValue("phoneNumber", phone); // Ensure form state is updated
                  }}
                />
              )}
            />
            {errors.phoneNumber && (
              <span className="text-red-500">{errors.phoneNumber.message}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="fullname">Full Name</label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="fullname"
                  placeholder="Your full name"
                  {...register("fullName")}
                  className={clsx(
                    "w-1/2 px-3 py-2",
                    "border border-slate-300 rounded-lg",
                    { "border-red-500": errors.email }
                  )}
                />
              )}
            />
            {errors.fullName && (
              <span className="text-red-500">{errors.fullName.message}</span>
            )}
          </div>
          <div>
            <LoadingButton context={"Submit"} isLoading={isLoading}/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDataFormPage;

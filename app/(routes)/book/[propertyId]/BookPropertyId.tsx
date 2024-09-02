"use client";
import {
  BedTypes,
  Property,
  PropertyLocation,
  PropertyRoomOption,
  RoomTypes,
  RoomTypesFacilities,
} from "@prisma/client";
import UsernameFormPage from "./_components/booked-information";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import clsx from "clsx";
import SubmitFormBtn from "@/components/submit-form-btn";
import BookedInformationPage from "./_components/booked-information";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(1, "Please fill in your first name"),
  lastName: z.string().min(1, "Please fill in your first name"),
  email: z.string().min(1, "Please fill in your email address"),
  phonenumber: z.string().min(1, "Please fill in your phone number"),
});

interface BookPropertyIdPageProps {
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
const BookPropertyIdPage = ({ property }: BookPropertyIdPageProps) => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  if (!roomId) {
    return null;
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phonenumber: "",
    },
  });
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div>
        <BookedInformationPage property={property} roomId={roomId} />
      </div>
      <div
        id="user-information-form"
        className="flex flex-col space-y-4 p-4 border border-indigo-100 rounded"
      >
        <div className="flex justify-center items-center p-4 bg-indigo-100 rounded border-2 border-indigo-100">
          <p>Please fill the form</p>
        </div>
        <form className="space-y-4" {...form} onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-5">
            <div className="flex flex-col w-full">
              <label htmlFor="username">Name</label>
              <input
                {...register("firstName")}
                type="text"
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
              <label htmlFor="username">Name</label>
              <input
                {...register("lastName")}
                type="text"
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
            <input
              {...register("phonenumber")}
              type="tel"
              defaultValue={getValues("phonenumber")}
              placeholder="your phone number"
              className={clsx(
                "w-1/2 px-3 py-2",
                "border border-slate-300 rounded-lg",
                { "border-red-500": errors.phonenumber }
              )}
            />
            {errors.phonenumber && (
              <span className="text-red-500">{errors.phonenumber.message}</span>
            )}
          </div>
          <div>
            <SubmitFormBtn />
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookPropertyIdPage;

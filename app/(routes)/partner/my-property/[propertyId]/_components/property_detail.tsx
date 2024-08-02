"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  BedTypes,
  Property,
  PropertyRoomOption,
  RoomTypes,
  RoomTypesFacilities,
} from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";

import { ChevronDown, ChevronRight, Pencil, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";

const formSchema = z.object({
  newRoomTypesName: z.string(),
  roomTypesId: z.string(),
  newBedTypesName: z.string(),
  bedTypesId: z.string(),
  newRoomTypeFacilities: z.string(),
  roomFacilitiesId: z.string(),
  propertyId: z.string(),
});

interface PropertyDetailFormProps {
  property: Property & {
    RoomOption: (PropertyRoomOption & {
      RoomTypes: (RoomTypes & {
        BedTypes: BedTypes[];
        RoomFacilities: RoomTypesFacilities[];
      })[];
    })[];
  };
}
const PropertyDetailForm = ({ property }: PropertyDetailFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facility, setFacility] = useState([]);
  const [isShow, setIsShow] = useState<string | null>(null);

  const bedTypes = ["Extra large double bed", "Double single bed"];

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newRoomTypesName: "",
      roomTypesId: "",
      newBedTypesName: "",
      bedTypesId: "",
      newRoomTypeFacilities: "",
      roomFacilitiesId: "",
      propertyId: property.id,
    },
  });
  const { handleSubmit, register } = form;
  const { isSubmitting, isValid } = form.formState;

  //Find room types
  const findRoomOption = property.RoomOption.filter(
    (opt) => opt.propertyId === property.id
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      let res;

      if (isAdding) {
        //check if it is add details state
        res = await axios.post("/api/property/create/details", data);
        if (res.status === 200) {
          toast.success("Property added successfully");
          router.refresh();
        }
      } else if (isEditting) {
        //check if it is edit details state
        const editData = { ...data, roomOptId: isShow };
        console.log("editt", editData);
        res = await axios.patch("/api/property/edit/details", editData);
        if (res.status === 200) {
          toast.success("Property updated successfully");
        }
      } else {
        console.log("type of action is not defined");
        return null;
      }
      console.log(data);
    } catch (error: any) {
      toast.error("Something went wrong");
      if (error && error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
      setIsEditting(false);
    }
  };

  const handleDelete = async (propertyId: string, roomOptId: string) => {
    try {
      console.log(propertyId);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-slate-300 rounded-lg">
      <div className="header p-3 flex justify-between items-center">
        <h1 className="text-md font-semibold italic">Rooms Details</h1>
        {isEditting || isAdding ? (
          <button
            onClick={() => {
              setIsEditting(false);
              setIsAdding(false);
            }}
            className="flex jutify-between items-center space-x-2 px-2 py-2 shadow rounded-lg"
          >
            <X className="h-4 w-4" />
            {isEditting ? "Cancel edit" : "Cancel add"}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setIsAdding(true);
              }}
              className="flex jutify-between items-center space-x-2 px-2 py-2 shadow rounded-lg"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add</span>
            </button>
            <button
              onClick={() => {
                setIsEditting(true);
              }}
              className="flex jutify-between items-center space-x-2 px-2 py-2 shadow rounded-lg"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </button>
          </div>
        )}
      </div>
      <div className="room-container"></div>
      <div className="container p-3 space-y-2">
        {!isAdding && !isEditting ? ( //is not editing
          findRoomOption ? (
            findRoomOption.map((roomOpt) => (
              <>
                <div
                  onClick={() =>
                    setIsShow(isShow === roomOpt.id ? null : roomOpt.id)
                  }
                  key={roomOpt.id}
                  className={clsx(
                    "bg-slate-200",
                    "p-2 rounded-md flex items-center justify-between"
                  )}
                >
                  <h2 className="">{roomOpt.RoomTypes.map((t) => t.name)}</h2>
                  {isShow === roomOpt.id ? <ChevronDown /> : <ChevronRight />}
                </div>
                {isShow
                  ? isShow === roomOpt.id && (
                      <div>
                        <div>
                          room type:{" "}
                          {roomOpt.RoomTypes.map(
                            (roomType) => roomType.BedTypes
                          )
                            .flat()
                            .map((bed) => bed.name)}
                        </div>
                        <div>
                          Facilities:{" "}
                          {roomOpt.RoomTypes.map(
                            (facility) => facility.RoomFacilities
                          )
                            .flat()
                            .map((facility) => facility.name)}
                        </div>
                      </div>
                    )
                  : null}
              </>
            ))
          ) : (
            <div>
              <h2 className="text-sm italic">Add Room Type</h2>
            </div>
          )
        ) : (
          isAdding && ( //Add rooms details state
            <div className="form-container mt-4">
              <form
                {...form}
                className="space-y-4"
                onSubmit={handleSubmit((data) => onSubmit(data))}
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold">Room Type Name:</p>
                  <input
                    {...register("newRoomTypesName")}
                    id="type-name"
                    className={clsx(
                      "p-2 rounded text-sm w-full ",
                      "border border-slate-200 focus:border-slate-300 focus:outline-none"
                    )}
                    type="text"
                    placeholder="e.g, deluxe room or primary room"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Room Type Beds:</p>
                  <div className="p-2  space-x-2 rounded text-sm w-full">
                    {bedTypes.map((bed) => (
                      <>
                        <input
                          {...register("newBedTypesName")}
                          id="type-beds"
                          className=""
                          type="radio"
                          value={bed}
                        />
                        <label htmlFor="type-beds">{bed}</label>
                      </>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Room Facilities:</p>
                  <div className="flex relative">
                    <input
                      {...register("newRoomTypeFacilities")}
                      id="facilities"
                      className={clsx(
                        "p-2 text-sm w-full ",
                        "border-b border-slate-200 focus:border-slate-300 focus:outline-none"
                      )}
                      type="text"
                      placeholder="e.g, air conditioner, tv, etc."
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    disabled={isSubmitting || !isValid}
                    className="p-2 shadow-md rounded-lg"
                    type="submit"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          )
        )}

        {/* edit property rooms details state */}
        {isEditting && (
          <div className="space-y-2">
            {findRoomOption ? (
              findRoomOption.map((roomOpt) => (
                <>
                  <div
                    onClick={() =>
                      setIsShow(isShow === roomOpt.id ? null : roomOpt.id)
                    }
                    key={roomOpt.id}
                    className={clsx(
                      "bg-slate-200",
                      "p-2 rounded-md flex items-center justify-between"
                    )}
                  >
                    <h2 className="">{roomOpt.RoomTypes.map((t) => t.name)}</h2>
                    {isShow === roomOpt.id ? <ChevronDown /> : <ChevronRight />}
                  </div>
                  {isShow
                    ? isShow === roomOpt.id && (
                        <div className="bg-slate-100 p-2">
                          <form
                            {...form}
                            onSubmit={handleSubmit((data) => onSubmit(data))}
                            className="space-y-2"
                          >
                            <div className="edit-room-name flex flex-col">
                              {roomOpt.RoomTypes.map((roomType) => (
                                <>
                                  <span className="text-sm italic">
                                    current room type name:{" "}
                                    <span className="font-semibold">
                                      {roomType.name}
                                    </span>
                                  </span>
                                  <input
                                    className={clsx(
                                      "p-2 rounded text-sm w-full ",
                                      "border border-slate-200 focus:border-slate-300 focus:outline-none"
                                    )}
                                    {...register("newRoomTypesName")}
                                    type="text"
                                    placeholder="Enter your new room types name"
                                    onChange={() =>
                                      form.setValue("roomTypesId", roomType.id)
                                    } //manually set the value
                                    data-room-type-id={roomType.id}
                                  />
                                </>
                              ))}
                            </div>
                            <div className="edit-room-typebed flex flex-col">
                              {roomOpt.RoomTypes.map(
                                (roomType) => roomType.BedTypes
                              )
                                .flat()
                                .map((bed) => (
                                  <>
                                    <span className="text-sm italic">
                                      current room type bed:{" "}
                                      <span className="font-semibold">
                                        {bed.name}
                                      </span>
                                    </span>
                                    <input
                                      className={clsx(
                                        "p-2 rounded text-sm w-full ",
                                        "border border-slate-200 focus:border-slate-300 focus:outline-none"
                                      )}
                                      {...register("newBedTypesName")}
                                      type="text"
                                      placeholder="Enter your new bed types"
                                      onChange={() => {
                                        form.setValue("bedTypesId", bed.id);
                                      }}//manually set the value
                                    />
                                  </>
                                ))}
                            </div>
                            <div>
                              {roomOpt.RoomTypes.map(
                                (roomType) => roomType.RoomFacilities
                              )
                                .flat()
                                .map((facility) => (
                                  <>
                                    <span className="text-sm italic">
                                      current room type facilities:{" "}
                                      <span className="font-semibold">
                                        {facility.name}
                                      </span>
                                    </span>
                                    <input
                                      className={clsx(
                                        "p-2 rounded text-sm w-full ",
                                        "border border-slate-200 focus:border-slate-300 focus:outline-none"
                                      )}
                                      {...register("newRoomTypeFacilities")}
                                      type="text"
                                      placeholder="Enter your new room types facilities"
                                      onChange={() => form.setValue("roomFacilitiesId", facility.id)}//manually set the value
                                    />
                                  </>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() =>
                                  handleDelete(property.id, roomOpt.id)
                                }
                                className="p-2 shadow-md rounded-lg bg-red-600 text-white"
                                type="submit"
                              >
                                {isLoading
                                  ? "Deleting..."
                                  : "Delete this room details"}
                              </button>
                              <button
                                disabled={isSubmitting || !isValid}
                                className="p-2 shadow-md rounded-lg"
                                type="submit"
                              >
                                {isLoading ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </form>
                        </div>
                      )
                    : null}
                </>
              ))
            ) : (
              <div>
                <h2 className="text-sm italic">Add Room Type</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailForm;

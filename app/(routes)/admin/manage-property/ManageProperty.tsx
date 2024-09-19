"use client";
import { Property } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { FileImage, List, PlusCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoadingButton from "@/components/loading-btn";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ManagePropertyProps {}
const ManagePropertyPage = ({}: ManagePropertyProps) => {
  const [recentProperty, setRecentProperty] = useState<Property>();
  const [unverifiedProperty, setUnverifiedProperty] = useState<Property>();
  type selectedPropertyProp = {
    property: Property;
    url: string;
  };
  const [selectedProperties, setSelectedProperties] =
    useState<selectedPropertyProp>();
  const [selectedPropertyImg, setSelectedPropertyImg] = useState<string | null>(
    null
  );
  const [recentPropSize, setRecentPropSize] = useState(1);
  const [unverPropSize, setUnverPropSize] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `/api/admin/property/get?recentPropSize=${recentPropSize}&unverPropSize=${unverPropSize}`
        );
        const recProperty = response.data.recentProperties;
        const unverProperty = response.data.unverifiedProperties;
        setRecentProperty(recProperty);
        setUnverifiedProperty(unverProperty);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProperty();
  }, [recentPropSize, unverPropSize]);

  useEffect(() => {
    const getPropertyDetails = async () => {
      try {
        const propertyId = selectedProperties?.property.id;
        const response = await axios.get(
          `/api/admin/property/details/get?propertyId=${propertyId}`,
          {
            params: { propertyId },
          }
        );
        const data = response.data;
        setSelectedPropertyImg(data.url);
      } catch (error) {
        return;
      }
    };
    getPropertyDetails();
  }, [selectedProperties]);

  const handleVerifyProperty = async (data: {
    id: string;
    confirmed?: boolean;
    name?: string;
  }) => {
    try {
      setIsLoading(true);
      const response: AxiosResponse = await axios.patch(
        `/api/admin/property/details/patch`,
        data
      );
      setSelectedProperties({ property: response.data.updatedProperty, url: "" })
      toast.success(response.data.message)
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="m-5 space-y-5">
      <h1 className="text-xl font-semibold">Manage Property</h1>
      <div className="">
        <div className="relative flex items-center w-full">
          <input
            className="w-full h-full focus:outline-none border border-slate-300 p-2 pl-8 rounded-lg"
            type="search"
            name=""
            id=""
            placeholder="search property..."
          />
          <Search className="inset-0 absolute left-2 top-2 text-slate-500 h-5 w-5" />
        </div>
      </div>
      <div className="h-40 flex bg-slate-100 rounded">
        {selectedProperties ? (
          <div className="p-1 w-full flex space-x-4 ">
            <div className="w-1/4 relative">
              {selectedPropertyImg ? (
                <Image
                  src={selectedPropertyImg || ""}
                  alt="property-img"
                  layout="fill"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-slate-200 text-slate-400 text-sm flex flex-col justify-center items-center w-full h-full">
                  <FileImage />
                  no img provided by the author
                </div>
              )}
            </div>
            <div>
              <h1 className="font-semibold">
                {selectedProperties.property.name}
              </h1>
              <p>
                created at:{" "}
                {new Date(
                  selectedProperties.property.createdAt
                ).toLocaleDateString()}
              </p>
              <p className="italic text-sm">
                status:{" "}
                {selectedProperties.property.confirmed
                  ? "verified"
                  : "unverified"}
              </p>
              <div>
                <LoadingButton
                  context={
                    selectedProperties.property.confirmed
                      ? "unverify"
                      : "verify"
                  }
                  isLoading={isLoading}
                  handleClick={() =>
                    handleVerifyProperty({
                      id: selectedProperties.property.id,
                      confirmed: selectedProperties.property.confirmed
                        ? false
                        : true,
                    })
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full text-slate-400">
            Select a property
          </div>
        )}
      </div>
      <div className="flex w-full space-x-3">
        <table
          id="table-1"
          className="w-1/2 border-collapse border border-gray-300 self-start"
        >
          <thead>
            <tr>
              <th className="flex  border border-gray-300 p-2">
                <List className="mr-2" />
                Property recently added
              </th>
            </tr>
          </thead>
          <tbody>
            {recentProperty &&
              Array.isArray(recentProperty) &&
              recentProperty.map((prop: Property) => (
                <tr key={prop.id}>
                  <td
                    onClick={() =>
                      setSelectedProperties({ property: prop, url: "" })
                    }
                    className="border border-gray-300 p-2"
                  >
                    {prop.name}
                  </td>
                </tr>
              ))}
            <tr onClick={() => setRecentPropSize(recentPropSize + 5)}>
              <td className="flex border border-gray-300 p-2 cursor-pointer ">
                Load more <PlusCircle className="ml-2 text-slate-500" />
              </td>
            </tr>
          </tbody>
        </table>
        <table
          id="table-2"
          className="w-1/2 border-collapse border border-gray-300 self-start"
        >
          <thead>
            <tr>
              <th className="flex  border border-gray-300 p-2">
                <List className="mr-2" />
                Unverified property
              </th>
            </tr>
          </thead>
          <tbody>
            {unverifiedProperty &&
              Array.isArray(unverifiedProperty) &&
              unverifiedProperty.map((prop: Property) => (
                <tr key={prop.id}>
                  <td
                    onClick={() =>
                      setSelectedProperties({ property: prop, url: "" })
                    }
                    className="border border-gray-300 p-2"
                  >
                    {prop.name}
                  </td>
                </tr>
              ))}
            <tr onClick={() => setUnverPropSize(unverPropSize + 5)}>
              <td className="flex border border-gray-300 p-2 cursor-pointer ">
                Load more <PlusCircle className="ml-2 text-slate-500" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePropertyPage;

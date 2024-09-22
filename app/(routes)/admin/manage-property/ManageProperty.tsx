"use client";
import { Property } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { FileImage, List, PlusCircle, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LoadingButton from "@/components/loading-btn";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { debounce } from "@/utils/debounce";
import clsx from "clsx";

type selectedPropertyProp = {
  property: Property;
  url: string;
};
type SelectedPropertyDetailsProp = {
  img: string;
  location: { country: string; county: string; state: string };
};
const ManagePropertyPage = () => {
  const [recentProperty, setRecentProperty] = useState<Property>();
  const [unverifiedProperty, setUnverifiedProperty] = useState<Property>();
  const [selectedProperties, setSelectedProperties] =
    useState<selectedPropertyProp>();
  const [selectedPropertyDetails, setSelectedPropertyDetails] =
    useState<SelectedPropertyDetailsProp | null>(null);
  const [recentPropSize, setRecentPropSize] = useState(1);
  const [unverPropSize, setUnverPropSize] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchedProperty, setSearchedProperty] = useState<Property[] | null>(
    null
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  //set selected property
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

  //set selected property details
  useEffect(() => {
    const getPropertyDetails = async () => {
      try {
        setSelectedPropertyDetails(null);
        const propertyId = selectedProperties?.property.id;
        const response = await axios.get(
          `/api/admin/property/details/get?propertyId=${propertyId}`,
          {
            params: { propertyId },
          }
        );
        type DataProps = {
          getPropertyImage: {
            url: string;
          };
          getPropertyLocation: {
            country: string;
            state: string;
            county: string;
          };
        };
        const data: DataProps = response.data;
        setSelectedPropertyDetails({
          img: data.getPropertyImage.url,
          location: {
            country: data.getPropertyLocation.country,
            county: data.getPropertyLocation.county,
            state: data.getPropertyLocation.state,
          },
        });
      } catch (error) {
        return;
      }
    };
    getPropertyDetails();
  }, [selectedProperties]);

  //search property
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const searchProperty = async () => {
      try {
        const response = await axios.get(`/api/admin/property/search`, {
          params: { keyword },
        });
        const data = response.data;
        setSearchedProperty(data);
      } catch (error) {
        console.log(error);
      }
    };
    const debouncedSearchProperty = debounce(searchProperty, 1000);
    debouncedSearchProperty();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [keyword]);

  //handle click property on search result
  const handlePropertySearchClick = (prop: Property) => {
    setSelectedProperties({ property: prop, url: "" });
    setKeyword("");
    setShowDropdown(false);
    setSearchedProperty(null); // Clear the search results when selecting an item
  };

  // Effect to detect clicks outside of the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false); // Clear search results if clicked outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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
      setSelectedProperties({
        property: response.data.updatedProperty,
        url: "",
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="m-5 space-y-5">
      <h1 className="text-xl font-semibold">Manage Property</h1>
      <div className="space-y-2 relative">
        <div className="flex items-center w-full">
          <input
            className="w-full h-full focus:outline-none border border-slate-300 p-2 pl-8 rounded-lg"
            type="search"
            name=""
            id=""
            placeholder="search property..."
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            onFocus={() => setShowDropdown(true)}
          />
          <Search className="inset-0 absolute left-2 top-2 text-slate-500 h-5 w-5" />
        </div>
        {showDropdown && (
          <div
            ref={dropdownRef}
            className={clsx(
              "absolute max-h-[180px] min-h-[40px] flex flex-col space-y-1 w-full p-1 cursor-pointer z-[9999] overflow-y-scroll",
              "bg-slate-100 shadow-md"
            )}
          >
            {searchedProperty ? (
              Array.isArray(searchedProperty) &&
              searchedProperty.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => handlePropertySearchClick(prop)}
                  className="h-[40px] p-1 flex items-center bg-slate-200"
                >
                  {prop.name}
                </div>
              ))
            ) : (
              <div className="flex items-center p-1 text-slate-400">
                type something...
              </div>
            )}
          </div>
        )}
      </div>
      <div className="h-40 flex bg-slate-50 rounded">
        {selectedProperties ? (
          <div className="p-1 w-full flex space-x-4 ">
            <div className="w-1/4 relative">
              {selectedPropertyDetails ? (
                <Image
                  src={selectedPropertyDetails.img || ""}
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
            <div className="flex flex-col space-y-1">
              <h1 className="font-semibold">
                {selectedProperties.property.name}
              </h1>
              <p className="italic text-sm">
                status:{" "}
                {selectedProperties.property.confirmed
                  ? "verified"
                  : "unverified"}
              </p>
              <p className="italic text-sm">
                Location:{" "}
                {selectedPropertyDetails ? (
                  <span>
                    {selectedPropertyDetails.location.country},{" "}
                    {selectedPropertyDetails.location.state},{" "}
                    {selectedPropertyDetails.location.county}
                  </span>
                ) : (
                  "no location was provided by the author"
                )}
              </p>
              <p className="italic text-sm">
                created at:{" "}
                {new Date(
                  selectedProperties.property.createdAt
                ).toLocaleDateString()}
              </p>
              <div className="flex space-x-3">
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
                <LoadingButton
                  context="look"
                  isLoading={isLoading}
                  handleClick={async () => router.push("/")}
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
                    className="border border-gray-300 p-2 cursor-pointer"
                  >
                    {prop.name}, date created:{" "}
                    {new Date(prop.createdAt).toLocaleDateString()}
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
                    className="border border-gray-300 p-2 cursor-pointer"
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

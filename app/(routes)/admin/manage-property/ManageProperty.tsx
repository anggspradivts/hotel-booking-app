"use client";
import { Property } from "@prisma/client";
import axios from "axios";
import { List, PlusCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "../Layout";

const ManagePropertyPage = () => {
  const [recentProperty, setRecentProperty] = useState<Property>();
  const [unverifiedProperty, setUnverifiedProperty] = useState<Property>();
  const [recentPropSize, setRecentPropSize] = useState(1);
  const [unverPropSize, setUnverPropSize] = useState(1);

  useEffect(() => {
    const fetchProperty = async () => {
      const response = await axios.get(
        `/api/admin/property/get?recentPropSize=${recentPropSize}&unverPropSize=${unverPropSize}`
      );
      const recProperty = response.data.recentProperties;
      const unverProperty = response.data.unverifiedProperties;
      setRecentProperty(recProperty);
      setUnverifiedProperty(unverProperty);
    };
    fetchProperty();
  }, [recentPropSize, unverPropSize]);

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
      <div className="h-20"></div>
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
                  <td className="border border-gray-300 p-2">{prop.name}</td>
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
                  <td className="border border-gray-300 p-2">{prop.name}</td>
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

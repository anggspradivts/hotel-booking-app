"use client"
import { Property } from "@prisma/client";
import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const ManagePropertyPage = () => {
  const [property, setProperty] = useState<Property>();
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchProperty = async () => {
      const response = await axios.get(`/api/admin/property/get?pageSize=${pageSize}`);
      setProperty(response.data);
    };
    fetchProperty();
  }, [pageSize]);


  return ( 
    <div className="md:px-28 space-y-5">
      <div className="flex justify-center mt-5">
        <p className="text-xl font-semibold">Manage Property</p>
      </div>
      <div className="flex justify-center">
        <div className="relative flex items-center w-[400px]">
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
      <div id="property-container" className="">
        {property && Array.isArray(property) && property.map((prop: Property) => (
          <div key={prop.id}>
            {prop.name}
          </div>
        ))
        }
      </div>
      <div>
        <button onClick={() => setPageSize(pageSize + 5)}>
          load more
        </button>
      </div>
    </div>
   );
}
 
export default ManagePropertyPage;
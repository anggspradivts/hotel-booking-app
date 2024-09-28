import { db } from "@/lib/db";
import BannerSec from "./_components/Banner";
import PropertySec from "./_components/Property";

const Homepage = async () => {
  // const getProperties = await db.property.findMany({
  //   where: {
  //     confirmed: true,
  //   },
  //   include: {
  //     LocationDetails: true,
  //     MainImage: true,
  //   },
  // });

  return (
    <div className="lg:px-28">
      <div className="flex justify-center w-full">
        <BannerSec />
      </div>
      <div className="flex items-center py-10">
        <h1 className="font-bold text-3xl">Recommended for you</h1>
      </div>
      <div className="flex space-x-2 overflow-x-scroll">
        {/* <PropertySec property={getProperties} /> */}
      </div>
    </div>
  );
};

export default Homepage;

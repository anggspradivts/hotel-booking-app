import { db } from "@/lib/db";
import BannerSec from "./_components/Banner";
import PropertySec from "./_components/Property";


const Homepage = async () => {
  const getProperties = await db.property.findMany({
    where: {
      confirmed: true
    }
  });
  
  return ( 
    <div className="md:mx-28">
      <BannerSec />
      <PropertySec />
    </div>
   );
}
 
export default Homepage;
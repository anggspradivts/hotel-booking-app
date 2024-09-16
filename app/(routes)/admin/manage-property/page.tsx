
import { db } from "@/lib/db";
import ManagePropertyPage from "./ManageProperty";

const page = async () => {
  return (
    <div>
      <ManagePropertyPage />
    </div>
  );
};

export default page;
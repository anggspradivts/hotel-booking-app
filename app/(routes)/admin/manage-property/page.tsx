"use server"
import AdminLayout from "../Layout";
import ManagePropertyPage from "./ManageProperty";

const page = async () => {
  return (
    <AdminLayout>
      <ManagePropertyPage />
    </AdminLayout>
  );
};

export default page;
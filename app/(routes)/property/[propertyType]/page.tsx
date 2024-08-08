const page = ({ params }: { params: { propertyType: string } }) => {
  const { propertyType } = params;
  return ( 
    <div>
      {propertyType}
    </div>
   );
}

export default page;
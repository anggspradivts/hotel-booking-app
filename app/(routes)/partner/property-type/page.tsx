const PropertyTypePage = () => {
  const propertyType = [
    {
      id: 1,
      type: "hotel",
      name: "Hotel",
    },
    {
      id: 2,
      type: "villa",
      name: "Villa",
    },
    {
      id: 3,
      type: "appartment",
      name: "Appartment",
    },
  ];

  return (
    <div className="md:px-28">
      <div className="flex justify-center items-center h-20">
        <h1>What type is your property</h1>
      </div>
      <div className="grid grid-cols-3">
        {propertyType.map((prop, index) => (
          <div className="flex items-center justify-center">
            <button className="h-24 w-44 bg-slate-300">{prop.name}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyTypePage;

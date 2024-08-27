import {
  BedTypes,
  Property,
  PropertyRoomOption,
  RoomTypes,
  RoomTypesFacilities,
} from "@prisma/client";

interface RoomOptionSecProps {
  property: Property & {
    RoomOption: (PropertyRoomOption & {
      RoomTypes: (RoomTypes & {
        BedTypes: BedTypes[];
        RoomFacilities: RoomTypesFacilities[];
      })[];
    })[];
  };
}
const RoomOptionSec = ({ property }: RoomOptionSecProps) => {
  return (
    <div>
      <div className="flex my-10 py-5 border-b border-slate-300">
        <h1 className="font-semibold text-lg">Room Details</h1>
      </div>
      <div className="flex flex-col space-y-3">
        {property.RoomOption.map((roomOpt) => (
          <div key={roomOpt.id}>
            {roomOpt.RoomTypes.map((roomType) => (
              <div key={roomType.id} className="md:min-h-[200px]">
                <div className="flex justify-center items-center py-5 border border-black bg-indigo-400 text-white">
                  <h1 className="font-semibold">{roomType.name}</h1>
                </div>
                <div className="grid md:grid-cols-3">
                  <div className="border border-black p-5">
                    Bed type: {roomType.BedTypes.map((bedType) => bedType.name)}
                  </div>
                  <div className="hidden md:block border border-black p-5">
                    facilities:{" "}
                    {roomType.RoomFacilities.map(
                      (facilities) => facilities.name
                    )}
                  </div>
                  <div className="border border-black">
                    <div className="flex flex-col space-y-2 justify-center items-center p-5">
                      <p>{roomType.price?.toNumber()}$ per night</p>
                      <button className="bg-indigo-400 text-white p-1 px-3">
                        Reserve
                      </button>
                    </div>
                    <div className=""></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomOptionSec;

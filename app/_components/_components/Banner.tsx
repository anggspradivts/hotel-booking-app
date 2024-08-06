const BannerSec = () => {
  return ( 
    <div className="container h-[500px]">
      <div style={{
        backgroundImage: `url("/hotel.jpeg")`,
        backgroundSize: "cover",
        backgroundColor: 'rgba(0, 0, 0, 20)',
      }} 
        className="h-full w-full"
      >
        <div className="w-full h-full space-y-3 flex flex-col justify-center items-center">
          <p className="text-3xl text-white font-semibold">The best accomodation you can find</p>
          <div className="flex space-x-2">
            <input type="text" />
            <input type="date" />
            <input type="text" />
          </div>
        </div>
      </div>
    </div>
   );
}

export default BannerSec;
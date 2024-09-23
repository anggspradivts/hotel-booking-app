-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'PARTNER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookedHistory" (
    "id" TEXT NOT NULL,
    "PropertiesBooked" TEXT NOT NULL,
    "UserBooked" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookedHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Property',
    "description" TEXT,
    "slug" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "OwnerId" TEXT NOT NULL,
    "PropertyType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyMainFacilities" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "propertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyMainFacilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainImage" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "key" TEXT,
    "propertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MainImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyLocation" (
    "id" TEXT NOT NULL,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "county" TEXT,
    "postcode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "propertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyRoomOption" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyRoomOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "price" DECIMAL(65,30),
    "PropertyRoomOptId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BedTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "RoomTypesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BedTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomTypesFacilities" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "RoomTypesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomTypesFacilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestsType" (
    "id" TEXT NOT NULL,
    "PropertyRoomOptId" TEXT,

    CONSTRAINT "GuestsType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyImages" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "propertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempUserBookData" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkin" TIMESTAMP(3) NOT NULL,
    "checkout" TIMESTAMP(3) NOT NULL,
    "totalCost" DECIMAL(65,30) NOT NULL,
    "totalDays" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempUserBookData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MainImage_propertyId_key" ON "MainImage"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyLocation_propertyId_key" ON "PropertyLocation"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyType_name_key" ON "PropertyType"("name");

-- AddForeignKey
ALTER TABLE "BookedHistory" ADD CONSTRAINT "BookedHistory_PropertiesBooked_fkey" FOREIGN KEY ("PropertiesBooked") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookedHistory" ADD CONSTRAINT "BookedHistory_UserBooked_fkey" FOREIGN KEY ("UserBooked") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_OwnerId_fkey" FOREIGN KEY ("OwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_PropertyType_fkey" FOREIGN KEY ("PropertyType") REFERENCES "PropertyType"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMainFacilities" ADD CONSTRAINT "PropertyMainFacilities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainImage" ADD CONSTRAINT "MainImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyLocation" ADD CONSTRAINT "PropertyLocation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyRoomOption" ADD CONSTRAINT "PropertyRoomOption_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypes" ADD CONSTRAINT "RoomTypes_PropertyRoomOptId_fkey" FOREIGN KEY ("PropertyRoomOptId") REFERENCES "PropertyRoomOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BedTypes" ADD CONSTRAINT "BedTypes_RoomTypesId_fkey" FOREIGN KEY ("RoomTypesId") REFERENCES "RoomTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypesFacilities" ADD CONSTRAINT "RoomTypesFacilities_RoomTypesId_fkey" FOREIGN KEY ("RoomTypesId") REFERENCES "RoomTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestsType" ADD CONSTRAINT "GuestsType_PropertyRoomOptId_fkey" FOREIGN KEY ("PropertyRoomOptId") REFERENCES "PropertyRoomOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyImages" ADD CONSTRAINT "PropertyImages_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempUserBookData" ADD CONSTRAINT "TempUserBookData_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "RoomTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempUserBookData" ADD CONSTRAINT "TempUserBookData_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

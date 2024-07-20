const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.PropertyType.createMany({
      data: [
        { name: "Hotel" },
        { name: "Appartment" },
        { name: "Villa" },
      ]
    })
    console.log("Success qurying database category")
  } catch (error) {
    console.log("Error from seeding the database", error)
  } finally {
    await database.$disconnect();
  }
}

main();
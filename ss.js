// testConnection.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("im working");
    const users = await prisma.user.findMany();
    // const hashedpass = await hashpassword("idk");
    // const user = await prisma.user.create({
    //   data: {
    //     username: "zizo",
    //     email: "zizo",
    //     password: hashedpass,
    //     joinDate: new Date(),
    //   },
    // });
    // console.log(user);
    if (!users) console.log("nun to show");

    return users;
  } catch (error) {
    throw Error(
      "something happened while creating your account, try again later."
    );
  }
}

main().catch((e) => {
  console.error("Error connecting to the database:", e);
});

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const resolver = {
  Query: {
    employeeFetch: async (username: string) =>
      await prisma.employee.findUnique({ where: { username } }),
  },
};

export default resolver

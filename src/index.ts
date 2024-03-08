import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { jwtHelper } from "./utils/jwtHelper";

export const prisma = new PrismaClient();

interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  userInfo: { userId: number | null } | null;
}

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }): Promise<Context> => {
      const userInfoValue = await jwtHelper.getUserInfoFromToken(
        req.headers.authorization as string
      );

      // Handle different cases based on userInfoValue
      const userInfo =
        userInfoValue !== null ? { userId: userInfoValue } : null;

      return { prisma, userInfo };
    },
  });

  console.log(`  Server ready at: ${url}`);
};

main();

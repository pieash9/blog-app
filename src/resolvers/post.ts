import { userLoader } from "../dataLoaders/userLoaders";

export const Post = {
  author: async (parent: any, args: any, { prisma, userInfo }: any) => {
    // console.log("user", parent.authorId);
    return userLoader.load(parent.authorId);
  },
};

import { postResolvers } from "./post";
import { authResolvers } from "./auth";

export const Mutation = {
  ...authResolvers,
  ...postResolvers,
};

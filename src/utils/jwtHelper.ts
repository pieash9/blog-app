import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

export const jwtHelper = async (payload: { userId: number }) => {
  const token = await jwt.sign({ payload }, config.jwt.secret as string, {
    expiresIn: "1D",
  });
  return token;
};

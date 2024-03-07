import jwt from "jsonwebtoken";
import config from "../config";

const generateToken = async (payload: { userId: number }) => {
  const token = await jwt.sign(payload, config.jwt.secret as string, {
    expiresIn: "1D",
  });
  return token;
};

const getUserInfoFromToken = async (token: string) => {
  try {
    const userData = jwt.verify(token, config.jwt.secret as string) as {
      userId: number;
    };

    return userData.userId;
  } catch (error) {
    return null;
  }
};

export const jwtHelper = {
  generateToken,
  getUserInfoFromToken,
};

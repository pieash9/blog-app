import bcrypt from "bcrypt";
import { jwtHelper } from "../../utils/jwtHelper";

interface UserInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export const authResolvers = {
  singup: async (parent: any, args: UserInfo, { prisma }: any) => {
    const isExist = await prisma.user.findFirst({
      where: {
        email: args.email,
      },
    });
    if (isExist) {
      return {
        userError: "Email is already exist",
        token: null,
      };
    }
    const hashPassword = await bcrypt.hash(args.password, 12);
    const newUser = await prisma.user.create({
      data: {
        name: args.name,
        email: args.email,
        password: hashPassword,
      },
    });

    if (args.bio) {
      await prisma.profile.create({
        data: {
          bio: args.bio,
          userId: newUser.id,
        },
      });
    }

    const token = await jwtHelper.generateToken({ userId: newUser.id });
    return { userError: null, token };
  },

  signin: async (parent: any, args: any, { prisma }: any) => {
    const user = await prisma.user.findFirst({
      where: {
        email: args.email,
      },
    });

    if (!user) {
      return {
        userError: "User does not exist",
        token: null,
      };
    }

    const correctPass = await bcrypt.compare(args.password, user?.password);

    if (!correctPass) {
      return {
        userError: "Incorrect password!",
        token: null,
      };
    }

    const token = await jwtHelper.generateToken({ userId: user.id });
    return {
      userError: null,
      token,
    };
  },
};

import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import * as bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const userParams = z.object({
    email: z.string(),
    password: z.string(),
  });

  const { email, password } = userParams.parse(req.body);

  const selectUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  const passwordMatch = bcrypt.compareSync(password, selectUser!.password);

  try {
    if (passwordMatch) {
      const userLoggedIn = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      let userAccount;

      if (userLoggedIn) {
        userAccount = await prisma.account.findFirst({
          where: {
            id: userLoggedIn?.id,
          },
        });
        return res.json({ userLoggedIn, userAccount });
      }
    } else {
      return res.status(403).send("Usuário ou senha incorretos");
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }

}
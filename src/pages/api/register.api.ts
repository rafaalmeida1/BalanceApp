// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import { prisma } from "@/src/lib/prisma";

const salt = bcrypt.genSaltSync(10);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userParams = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  });

  const { username, email, password } = userParams.parse(req.body);

  const id = Date.now();

  const findUserAlreadyExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!email.trim()) {
    return res.status(404).send("Email is required");
  }

  let user;

  if (findUserAlreadyExists) {
    return res.status(400).send("Email already exists");
  } else {
    user = await prisma.user.create({
      data: {
        id: String(id),
        username,
        email,
        password: bcrypt.hashSync(password, salt),

        user_account: {
          create: {
            id: String(id),
            balance: 1000,
          },
        },
      },
    });
  }

  const userAccount = await prisma.account.findUnique({
    where: {
      id: String(id),
    },
  });

  res.json({
    user,
    userAccount,
  });
}

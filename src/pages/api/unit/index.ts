import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";
import type { Unit } from "@prisma/client";

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ error?: string } | undefined>
) => {


  if (req.method === "POST") {
    try {
      await prisma.unit.create({
        data: JSON.parse(req.body) as Unit,
      });
      res.status(201);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        e.code === "P2002"
          ? res.status(500).json({
              error:
                "This voyage cannot have new unit with this registration number. ",
            })
          : res.status(400);
      }
    }

    res.end();
    return;
  }

  res.status(405).end();
};

export default handler;

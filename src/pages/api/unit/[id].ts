import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { prisma } from "~/server/db";

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<undefined>
) => {
  
  if (req.method === "DELETE") {
    const deletedVoyage = await prisma.unit.delete({
      where: {
        id: req.query.id as string,
      },
    });

    deletedVoyage ? res.status(204) : res.status(404);
    res.end();
    return;
  }

  res.status(405).end();
};

export default handler;

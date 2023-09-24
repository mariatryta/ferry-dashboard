import type { Unit, Vessel, Voyage } from "@prisma/client";
import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { prisma } from "~/server/db";

export type VoyageWithVessel = (Voyage & { vessel: Vessel })[];
export type VoyageWithUnitVessel = Voyage & { vessel: Vessel } & {
  units: Unit[];
};

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<undefined | VoyageWithUnitVessel>
) => {
  if (req.method === "DELETE") {
    // randomly fail the delete request
    const maybe = Math.round(Math.random());
    if (maybe) {
      res.status(400).end();
      return;
    }

    const deletedVoyage = await prisma.voyage.delete({
      where: {
        id: req.query.id as string,
      },
    });

    deletedVoyage ? res.status(204) : res.status(404);
    res.end();
    return;
  }

  if (req.method === "GET") {
    const id = req.query.id;

    const voyage = await prisma.voyage.findUnique({
      where: {
        id: id as string,
      },
      include: {
        vessel: true,
        units: true,
      },
    });

    if (voyage) {
      return res.status(200).json(voyage);
    } else {
      return res.status(404).end();
    }
  }

  
  res.status(405).end();
};

export default handler;

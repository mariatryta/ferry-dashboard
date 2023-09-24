import { PrismaClient, Voyage } from "@prisma/client";
import { addDays, setHours, startOfHour } from "date-fns";

const UNIT_TYPES =  [
  'car',
  'van',
  'truck'
 ] as const;

const prisma = new PrismaClient();

async function createUnit(voyageId: string) {
  const randomUnitType =
    UNIT_TYPES[Math.floor(Math.random() * UNIT_TYPES.length)];

  await prisma.unit.create({
    data: {
      registrationNumber: Math.random().toString(36).slice(2),
      type: randomUnitType,
      length: Math.floor(Math.random() * 10),
      voyageId: voyageId,
    },
  });
}

async function createVoyages(
  departingFromOsloVessel: string,
  departingFromCopenhagenVessel: string,
  i: number
): Promise<Voyage[]> {
  const scheduledDeparture = startOfHour(setHours(addDays(new Date(), i), 15));
  const scheduledArrival = startOfHour(setHours(addDays(new Date(), i + 1), 9));

  const CopenhagenToOslo = await prisma.voyage.create({
    data: {
      portOfLoading: "Copenhagen",
      portOfDischarge: "Oslo",
      vesselId: departingFromCopenhagenVessel,
      scheduledDeparture,
      scheduledArrival,
    },
  });

  const OsloToCopenhagen = await prisma.voyage.create({
    data: {
      portOfLoading: "Oslo",
      portOfDischarge: "Copenhagen",
      vesselId: departingFromOsloVessel,
      scheduledDeparture,
      scheduledArrival,
    },
  });

  return Promise.all([CopenhagenToOslo, OsloToCopenhagen]);
}

async function main() {
  const crownSeaways = await prisma.vessel.create({
    data: {
      name: "Crown Seaways",
    },
  });

  const pearlSeaways = await prisma.vessel.create({
    data: {
      name: "Pearl Seaways",
    },
  });

  // Seeding voyages
  for (let i = 0; i < 10; i++) {
    const departingFromCopenhagenVessel =
      i % 2 === 0 ? pearlSeaways.id : crownSeaways.id;
    const departingFromOsloVessel =
      i % 2 === 0 ? crownSeaways.id : pearlSeaways.id;

    const voyages = await createVoyages(
      departingFromCopenhagenVessel,
      departingFromOsloVessel,
      i
    );

    voyages.forEach(async (voyage) => {
      for (let i = 0; i < 6; i++) {
        await createUnit(voyage.id);
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

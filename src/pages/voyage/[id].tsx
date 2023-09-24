import { Button } from "~/components/ui/button";
import type { GetServerSidePropsContext } from "next";

import Head from "next/head";
import Layout from "~/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import type { ReturnType } from "../api/voyage/getVoyageById";
import { Unit } from "@prisma/client";
import { format } from "date-fns";
import { TABLE_DATE_FORMAT } from "~/constants";
import { useRouter } from "next/router";
import { apiRequest } from "~/utils";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CreateUnitSheet } from "~/components/view/CreateUnitSheet";

const OverviewLabel = ({ label }: { label: string }) => {
  return <span className="mr-2 font-bold">{label}</span>;
};

export default function Home(props: { voyage: ReturnType }) {
  const { query } = useRouter();
  const { data: voyage } = useQuery<ReturnType>({
    queryKey: ["voyage", query.id],
    queryFn: async () =>
      await apiRequest(`/voyage/getVoyageById?id=${query.id}`, "GET"),
    initialData: props.voyage,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (unitId: string) => {
      const response = await fetch(`/api/unit?id=${unitId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the unit");
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["voyage", query.id]);
      },
    }
  );

  const handleDelete = (unitId: string) => {
    mutation.mutate(unitId);
  };

  return (
    <>
      <Head>
        <title>Units | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="m-0 flex w-full flex-col p-0">
          <div className="flex w-full items-center  justify-between border-b border-white border-opacity-50  py-4">
            <CreateUnitSheet></CreateUnitSheet>
            <div>
              <OverviewLabel
                label={`From ${voyage.portOfLoading} to ${voyage.portOfDischarge} | `}
              ></OverviewLabel>
              <OverviewLabel label="Vessel"></OverviewLabel>
              <span className="mr-2"> {voyage.vessel.name} | </span>
              <OverviewLabel label="Departure time "></OverviewLabel>
              <span className="mr-2">
                {format(new Date(voyage.scheduledDeparture), TABLE_DATE_FORMAT)}
              </span>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sequence number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Lenght</TableHead>
                <TableHead>Registration number</TableHead>
                <TableHead>Delete unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {voyage?.units?.map((unit: Unit, i: number) => (
                <TableRow key={unit.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{unit.type}</TableCell>
                  <TableCell>{unit.length}</TableCell>
                  <TableCell>{unit.registrationNumber}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDelete(unit.id)}
                      variant="outline"
                    >
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/voyage/getVoyageById?id=${context.query.id}`
  );

  if (res.status === 404) {
    return {
      notFound: true,
    };
  }
  const data = await res.json();
  return {
    props: {
      voyage: data,
    },
  };
};

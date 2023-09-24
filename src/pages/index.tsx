import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "~/utils";
import Layout from "~/components/layout";
import { useToast } from "~/hooks/use-toast";
import { TABLE_DATE_FORMAT } from "~/constants";
import type { VoyageIndexResponsePayload } from "./api/voyage";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";

export default function Home() {
  const { data: voyages } = useQuery<VoyageIndexResponsePayload>(
    ["voyages"],
    () => apiRequest("voyage", "GET")
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (voyageId: string) => {
      await apiRequest(`voyage/${voyageId}`, "DELETE");
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["voyages"]);
      },
      onError: (error: Error) => {
        toast({
          title: "Voyage couldn't be deleted",
          description: "Try again or contact our support department",
        });

        throw new Error(error.message);
      },
    }
  );

  const handleDelete = (voyageId: string) => {
    mutation.mutate(voyageId);
  };

  return (
    <>
      <Head>
        <title>Voyages | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Port of loading</TableHead>
              <TableHead>Port of discharge</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voyages?.map((voyage) => (
              <TableRow key={voyage.id}>
                <TableCell>
                  <Link href={`/voyage/${voyage.id}`}>
                    {format(
                      new Date(voyage.scheduledDeparture),
                      TABLE_DATE_FORMAT
                    )}
                  </Link>
                </TableCell>
                <TableCell>
                  {format(new Date(voyage.scheduledArrival), TABLE_DATE_FORMAT)}
                </TableCell>
                <TableCell>{voyage.portOfLoading}</TableCell>
                <TableCell>{voyage.portOfDischarge}</TableCell>
                <TableCell>{voyage.vessel.name}</TableCell>
                <TableCell>
                  <Link
                    href={`/voyage/${voyage.id}`}
                    className="underline decoration-stone-100"
                  >
                    {voyage.units.length}
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(voyage.id)}
                    variant="outline"
                  >
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
    </>
  );
}

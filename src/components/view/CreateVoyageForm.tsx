import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "~/utils";
import { useToast } from "~/hooks/use-toast";
import type { VesselIndexResponsePayload } from "~/pages/api/vessel";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const CreateVoyageFormSchema = z
  .object({
    scheduledArrival: z.coerce
      .date({ required_error: "Field is required" })
      .transform((val) => val.toISOString()),

    scheduledDeparture: z.coerce
      .date({ required_error: "Field is required" })
      .transform((val) => val.toISOString()),

    portOfLoading: z
      .string({
        required_error: "Field is required",
      })
      .min(2, {
        message: "Value must be at least 2 characters.",
      }),
    portOfDischarge: z
      .string({
        required_error: "Field is required",
      })
      .min(2, {
        message: "Value must be at least 2 characters.",
      }),
    vesselId: z.string(),
  })
  .refine(
    (schema) => {
      return schema.scheduledDeparture < schema.scheduledArrival;
    },
    {
      message: "Departure time must be before arrival time",
      path: ["scheduledDeparture"],
    }
  );

export function CreateVoyageForm() {
  const { toast } = useToast();
  const { data: vessels } = useQuery<VesselIndexResponsePayload>(
    ["vessels"],
    () => apiRequest("vessel", "GET")
  );
  const form = useForm<z.infer<typeof CreateVoyageFormSchema>>({
    resolver: zodResolver(CreateVoyageFormSchema),
    defaultValues: {
      scheduledArrival: undefined,
      scheduledDeparture: undefined,
    },
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof CreateVoyageFormSchema>) => {
      await apiRequest("voyage", "POST", JSON.stringify(values));
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries(["voyages"]);

      toast({
        title: "Voyage succesfully created",
      });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const createVoyage = (values: z.infer<typeof CreateVoyageFormSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createVoyage)} className="py-4">
        <FormField
          control={form.control}
          name="scheduledDeparture"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel> Departure time and date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="datetime-local"
                  required
                  id="scheduledDeparture"
                  className="col-span-3"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledArrival"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel> Arrival time and date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="datetime-local"
                  required
                  id="scheduledArrival"
                  className="col-span-3"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portOfLoading"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel> Port of loading </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  required
                  placeholder="Copenhagen"
                  id="portOfLoading"
                  className="col-span-3"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portOfDischarge"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel> Port of discharge </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  required
                  placeholder="Oslo"
                  id="portOfDischarge"
                  className="col-span-3"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vesselId"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel> Vessel </FormLabel>
              <FormControl>
                {vessels && (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vessel" />
                    </SelectTrigger>
                    <SelectContent>
                      {vessels.map((vessel) => (
                        <SelectItem value={vessel.id} key={vessel.id}>
                          {vessel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="my-4">
          Save Voyage
        </Button>
      </form>
    </Form>
  );
}

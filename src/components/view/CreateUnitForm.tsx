import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "~/utils";
import { UNIT_TYPES } from "~/constants";
import { useToast } from "~/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

const formSchema = z.object({
  type: z.string({
    required_error: "Field is required",
  }),
  registrationNumber: z.string().min(4).max(10),
  length: z.coerce.number().positive(),
});

export function CreateUnitForm() {
  const [error, setError] = useState<null | string>(null);

  const { query } = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      await apiRequest(
        "unit",
        "POST",
        JSON.stringify({ ...values, voyageId: query.id })
      );
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries(["voyage", query.id]);
      toast({
        title: "Unit created",
        description: "Your unit has been succesfully added to the voyage",
      });
    },

    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const createUnit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createUnit)} className="py-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel> Type </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_TYPES.map((unit) => (
                      <SelectItem value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel> Length </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="17"
                  step="0.5"
                  required
                  id="length"
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
          name="registrationNumber"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel> Registration Number </FormLabel>
              <FormControl>
                <Input
                  type="string"
                  required
                  min="2"
                  max="10"
                  id="registrationNumber"
                  className="col-span-3"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="my-4">
          Save Unit
        </Button>

        {error && (
          <div className="text-xs font-semibold text-destructive">{error}</div>
        )}
      </form>
    </Form>
  );
}

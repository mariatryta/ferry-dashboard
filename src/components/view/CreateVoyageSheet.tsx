import { Button } from "~/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { CreateVoyageForm } from "./CreateVoyageForm";

export function CreateVoyageSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="mx-4 shrink-0"
          aria-label="Create new voyage"
        >
          Create Voyage
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Voyage</SheetTitle>
        </SheetHeader>

        <CreateVoyageForm></CreateVoyageForm>
      </SheetContent>
    </Sheet>
  );
}

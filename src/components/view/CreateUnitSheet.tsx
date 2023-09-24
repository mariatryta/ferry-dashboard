import { Button } from "~/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { CreateUnitForm } from "./CreateUnitForm";

export function CreateUnitSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="mx-4 shrink-0"
          aria-label="Create new unit"
        >
          Create unit
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create unit</SheetTitle>
        </SheetHeader>

        <CreateUnitForm />
      </SheetContent>
    </Sheet>
  );
}

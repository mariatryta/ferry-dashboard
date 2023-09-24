# Fullstack code challenge

The task of this code challenge is to add functionality described below to this existing sample application: https://github.com/dfds-frontend/fs-dev-challenge. The application is built using NextJS, Typescript, Prisma, React Query Tailwind, zod and https://ui.shadcn.com/ for ready-made components. It is expected that you will complete the below tasks using the technologies listed.

The challenge consists of a variety of frontend, backend and data modeling tasks. We invite you to tailor your implementation as close to the description as possible, otherwise be sure to document deviations if any. 

## Task 1 - Create new voyage
At the root of the application, place a button “Create” on the top left of the list of mock voyages.
When pressed, the button should open https://ui.shadcn.com/docs/components/sheet with the form for creating a voyage inside
The form should have the following validations:
All fields are required
Departure date and time should be before arrival date and time
Refresh the list of voyages once a voyage has been successfully created
Display https://ui.shadcn.com/docs/components/toast with a success message.

## Task 2 - Introduce Unit data model
A unit or a freight unit is a vehicle that can be transported on a ferry. 

The model should have the following properties:
type which can be one of the following: Car, Van, Truck
length
registration number

Additionally, a unit should be linked to voyage through a many-to-one relationship. 

It is not necessary to generate a migration, it is sufficient just to “push” the new model to the database. 

Finally, when the model is in the database, be sure to update the seed.ts file to create some units for each voyage. 

## Task 3 - List units
Add a new column in the voyage table called “units” and for each voyage display the number of units associated with that voyage.
When a user clicks on a voyage, they are taken to the unit list. 
At the top of the screen, there should be information about the voyage:
Route
Name of the ferry
Departure time
The list should display the unit sequence number (1, 2, 3 etc.) , unit type, it’s length and registration number.
It should be possible to delete a unit similar to how it is possible to delete a voyage. 

## Task 4 - Add a unit
Between the route information and the list of units, on the top left corner of the unit list, add a button “Add unit”
When pressed, the button should open https://ui.shadcn.com/docs/components/sheet with the form for adding a unit to the voyage inside
The form should have the following validations:
All fields are required
There should not be two units with the same registration number on the same voyage
Refresh the unit list once the unit has been successfully created.
Display https://ui.shadcn.com/docs/components/toast with a success message.

## Task 5 - Handling voyage deletion error
You may have noticed that deleting a voyage does not always work. Add error handling to inform the user when that happens. It is sufficient to show https://ui.shadcn.com/docs/components/toast with the appropriate error message. 

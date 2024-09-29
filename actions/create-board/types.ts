import { z } from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

// We can infer the type of schema using this zod function
// Extract the inferred type into the InputType
// This InputType will be the input type that will be passed into FieldErrors
export type InputType = z.infer<typeof CreateBoard>;

// It takes in the input type and returns the output type
// Here the Input is the fields: a title and image in string format
// Output is of type Board from Prisma
export type ReturnType = ActionState<InputType, Board>;

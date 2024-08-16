import { z } from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

// We can infer the type of schema using this zod function
// This InputType will be the input type that will be passed into FieldErrors
export type InputType = z.infer<typeof CreateBoard>;
export type OutputType = ActionState<InputType, Board>;

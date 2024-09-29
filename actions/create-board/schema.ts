import { z } from "zod";

// Schema for CreateBoard
// When I create a Board it has these properties: a title and an image both in string format
export const CreateBoard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, { message: "Title is too short." }),
  image: z.string({
    required_error: "Image is required",
    invalid_type_error: "Image is required",
  }),
});

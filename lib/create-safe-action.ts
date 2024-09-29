import { z } from "zod";

// Here we define the type of FieldErrors
export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

// This type is used to represent the state of an action. An action could be anything like creating a board, updating a card, etc.
// We can return either of the three from this at various stages of validation
export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>; // Errors related to specific fields in the input.
  error?: string | null; // A general error message, usually from the server.
  data?: TOutput; // The successful result of the action, typically a type from Prisma.
};

// Checks if the data is valid
/* 
- The function first validates the input data.
- If the data is valid (i.e., no field errors), it calls a handler function with the validated data.
- The handler function then performs the desired action and returns a success response.
*/
export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  // Everything starts here. This function will become the createBoard function which will become action which will become the execute function
  // when we call: const result = await action(input)
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    // Here we validate the data. It returns { success: false; error: ZodError } if not valid
    const validationResult = schema.safeParse(data);
    // Meaning success = false and error = ZodError
    if (!validationResult.success) {
      return {
        // Here we return an validations errors and return fieldErrors
        fieldErrors: validationResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    // If we get here, we know that the data is valid and without any field errors
    // returns { success: true; data: "tuna" }
    return handler(validationResult.data);
  };
};

import { z } from "zod";

// Here we define the type of FieldErrors
// For example: we pass in the type of the Board schema
export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

// We can return either of the three from this at various stages of validation
export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>; // Any field errors
  error?: string | null; // Server error
  data?: TOutput; // Success data - Prisma type
};

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
      return {
        // Here we return an validations errors and return fieldErrors
        fieldErrors: validationResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    // If we get here, we know that the data is valid and without any field errors
    return handler(validationResult.data);
  };
};

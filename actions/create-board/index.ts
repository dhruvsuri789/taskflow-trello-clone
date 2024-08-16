"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./types";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<OutputType> => {
  const { userId } = auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { title } = data;

  let board;

  try {
    board = await prismaClient.board.create({
      data: {
        title,
      },
    });
  } catch (error) {
    return { error: "Failed to create board" };
  }

  revalidatePath(`/board/${board.id}`);
  // We return data as it passed all the FieldErrors checks (validation) and any server errors
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);

"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { items, boardId } = data;

  let lists;

  try {
    // Creating multiple updates in a single transaction
    const transaction = items.map((list) => {
      return prismaClient.list.update({
        where: {
          id: list.id,
          board: {
            orgId,
          },
        },
        data: {
          order: list.order,
        },
      });
    });

    lists = await prismaClient.$transaction(transaction);
  } catch (error) {
    return { error: "Failed to reorder" };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);

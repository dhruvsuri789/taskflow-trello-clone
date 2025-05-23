"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { items, boardId } = data;

  let updatedCards;

  try {
    // Creating multiple updates in a single transaction
    const transaction = items.map((card) => {
      return prismaClient.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      });
    });
    updatedCards = await prismaClient.$transaction(transaction);
  } catch (error) {
    return { error: "Failed to reorder" };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: updatedCards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);

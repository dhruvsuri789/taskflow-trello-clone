"use server";

import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function deleteBoard(id: string) {
  await prismaClient.board.delete({
    where: {
      id,
    },
  });

  revalidatePath("/organization/org_2kdyyKYP4OG3qq2NvoYYJjwhxp3");
}

export default deleteBoard;

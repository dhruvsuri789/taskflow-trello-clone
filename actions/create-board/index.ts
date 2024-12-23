"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { prismaClient } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/types";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { unsplash } from "@/lib/unsplash";

// This snippet is part of a function (createSafeAction) that validates data and then processes it if it's valid.
/* 
- The handler function then performs the desired action and returns a success response.
*/
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const canCreate = await hasAvailableCount();
  const isPro = await checkSubscription();

  if (!canCreate && !isPro) {
    return {
      error:
        "You have reached your limit of free boards. Please upgrade to create more.",
    };
  }

  const { title, image } = data;

  const [
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUserName,
    imageDownloadLocation,
  ] = image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return { error: "Missing fields. Failed to create board." };
  }

  let board;

  try {
    board = await prismaClient.board.create({
      data: {
        title,
        orgId: orgId ?? "",
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
      },
    });

    // Increase count only when it's not pro, in other words its free mode
    if (!isPro) {
      await incrementAvailableCount();
    }

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });

    //for image download counter on Unsplash
    // await fetch(
    //   `${imageDownloadLocation}?client_id=${process.env
    //     .NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!}`
    // );

    // console.log(imageDownloadLocation);
    await unsplash.photos.trackDownload({
      downloadLocation: imageDownloadLocation,
    });
  } catch (error) {
    return { error: "Failed to create board" };
  }

  // try {
  //   await unsplash.photos.trackDownload({
  //     downloadLocation: imageDownloadLocation,
  //   });
  // } catch (error) {
  //   console.log("Failed to track download on Unsplash");
  // }

  revalidatePath(`/board/${board.id}`);
  // We return data as it passed all the FieldErrors checks (validation) and any server errors
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);

import { auth } from "@clerk/nextjs/server";
import { prismaClient } from "@/lib/db";
import { MAX_FREE_BOARDS } from "@/constants/boards";

/**
 * Increments the available count for the organization.
 * If the organization limit exists, increments the count by 1.
 * Otherwise, creates a new organization limit with a count of 1.
 */
export const incrementAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  // Check if the organization limit record exists for this organization
  const orgLimit = await prismaClient.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  // If there is a record, increment the count else create a new record with count = 1
  if (orgLimit) {
    await prismaClient.orgLimit.update({
      where: {
        orgId,
      },
      data: {
        count: orgLimit.count + 1,
      },
    });
  } else {
    await prismaClient.orgLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};

/**
 * Decreases the available count for the organization.
 * If the organization limit exists, decrements the count by 1, ensuring it doesn't go below 0.
 * Otherwise, creates a new organization limit with a count of 1.
 */
export const decreaseAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  // Check if the organization limit record exists for this organization
  const orgLimit = await prismaClient.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  // If there is a record, decrement the count else create a new record with count = 1
  if (orgLimit) {
    await prismaClient.orgLimit.update({
      where: {
        orgId,
      },
      data: {
        count: orgLimit.count > 0 ? orgLimit.count - 1 : 0,
      },
    });
  } else {
    await prismaClient.orgLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};

/**
 * Checks if the organization has available count below the maximum free boards limit.
 * This is called before the user creates a new board.
 */
export const hasAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  // Check if the organization limit record exists for this organization
  const orgLimit = await prismaClient.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  // Returns true if the count is below the limit or if no limit exists, otherwise returns false.
  // After the count reaches 5 and the user tries to create a new board, the board will not be created as this will return false(5<5).
  if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
    return true;
  } else {
    return false;
  }
};

/**
 * Retrieves the available count for the organization.
 * Returns 0 if the user is unauthorized or if no organization limit exists.
 * Otherwise, returns the current count.
 */
export const getAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return 0;
  }

  const orgLimit = await prismaClient.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (!orgLimit) {
    return 0;
  } else {
    return orgLimit.count;
  }
};

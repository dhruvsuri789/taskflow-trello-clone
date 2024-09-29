import { auth, currentUser } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { prismaClient } from "@/lib/db";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

/**
 * Creates an audit log entry in the database.
 *
 * @param {Props} props - The properties required to create an audit log.
 * @param {string} props.entityId - The ID of the entity being logged.
 * @param {string} props.entityType - The type of the entity being logged.
 * @param {string} props.entityTitle - The title of the entity being logged.
 * @param {string} props.action - The action performed on the entity.
 *
 * @throws Will throw an error if the user or organization ID is not found.
 */
export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!user || !orgId) {
      throw new Error("User not found!");
    }

    const { entityId, entityType, entityTitle, action } = props;
    await prismaClient.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + " " + user?.lastName,
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};

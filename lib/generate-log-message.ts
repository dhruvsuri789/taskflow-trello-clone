import { AuditLog } from "@prisma/client";
import { ACTION } from "@/types";

/**
 * Generates a log message based on the action performed on an entity.
 *
 * @param {AuditLog} log - The audit log object containing details of the action.
 * @param {string} log.action - The action performed (CREATE, UPDATE, DELETE).
 * @param {string} log.entityTitle - The title of the entity.
 * @param {string} log.entityType - The type of the entity.
 * @returns The generated log message as a string.
 */
export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;
  switch (action) {
    case ACTION.CREATE:
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.UPDATE:
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.DELETE:
      return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
  }
};

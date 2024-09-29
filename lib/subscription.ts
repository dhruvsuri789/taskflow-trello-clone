import { auth } from "@clerk/nextjs/server";
import { prismaClient } from "@/lib/db";

// This adds a constant value DAY_IN_MS (which presumably represents the number of milliseconds in a day) to the timestamp obtained from getTime() down below.
const DAY_IN_MS = 86_400_000;

/**
 * Checks the subscription status of an organization.
 *
 * @returns A promise that resolves to a boolean indicating whether the subscription is valid.
 */
export const checkSubscription = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return false;
  }

  const orgSubscription = await prismaClient.orgSubscription.findUnique({
    where: {
      orgId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!orgSubscription) {
    return false;
  }

  //Check if subscription is valid by adding buffer day DAY_IN_MS
  /* 
  The purpose of this code is to determine if an organization's subscription is valid. The subscription is considered valid if:
  - orgSubscription.stripePriceId is truthy (indicating that there is a valid Stripe price ID associated with the subscription).
  - The current date and time (Date.now()) is less than the subscription period end date plus one day (orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS).
  
  In simpler terms, this code checks if the organization has an active subscription by verifying two conditions:
  - The subscription has a valid Stripe price ID.
  - The subscription has not expired (considering an additional day as a grace period).
  
  If both conditions are met, isValid will be true; otherwise, it will be false.
  */
  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  //Converting into a boolean
  return !!isValid;
};

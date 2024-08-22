import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// Will be called by stripe automatically again and again during the checkout process
export async function POST(request: Request) {
  const body = await request.text();
  // Making sure stripe is calling the webhook
  // We want to protect this endpoint
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse("Webhook error", { status: 400 });
  }

  // Continue and actually finish the users checkout
  // This will have details of the user's credit card and others

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle the checkout event
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.orgId) {
      return new NextResponse("Org ID is required", { status: 400 });
    }

    // Create the subscription
    await prismaClient.orgSubscription.create({
      data: {
        orgId: session?.metadata?.orgId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  // Handle the payment successful event
  // That means they have paid or renewed their subscription
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prismaClient.orgSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}

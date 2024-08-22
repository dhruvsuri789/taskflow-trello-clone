"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import useProModal from "@/hooks/useProModal";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  isPro: boolean;
}

function SubscriptionButton({ isPro }: SubscriptionButtonProps) {
  const proModal = useProModal();
  //stripeRedirect can handle initial upgrade and billing portal
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onClick = () => {
    if (isPro) {
      execute({});
    } else {
      proModal.onOpen();
    }
  };

  return (
    <Button variant="primary" disabled={isLoading} onClick={onClick}>
      {isPro ? "Manage Subscription" : "Upgrade to pro"}
    </Button>
  );
}

export default SubscriptionButton;

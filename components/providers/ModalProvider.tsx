"use client";

import { useEffect, useState } from "react";
import CardModal from "@/components/modals/card-modal";
import ProModal from "@/components/modals/ProModal";

/**
 * ModalProvider component that ensures modals are only rendered on the client side.
 * This prevents hydration errors by checking if the component is mounted.
 *
 * @returns The rendered modals or null if the component is not yet mounted.
 */
function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Preventing hydration errors
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CardModal />
      <ProModal />
    </>
  );
}

export default ModalProvider;

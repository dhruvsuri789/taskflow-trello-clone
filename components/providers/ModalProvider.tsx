"use client";

import { useEffect, useState } from "react";
import CardModal from "../modals/card-modal";

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
    </>
  );
}

export default ModalProvider;

"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import useMobileSidebar from "@/hooks/useMobileSidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function MobileSidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const onOpen = useMobileSidebar((state) => state.onOpen);
  const onClose = useMobileSidebar((state) => state.onClose);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  // To prevent hydration errors
  // It makes sure the component is returns JSX only in client side.
  // Because this will be true only on client side as useEffect will run only in client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Automatically close the sidebar whenever the pathname changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // And this will then become false and will not run
  if (!isMounted) return null;

  // And this will run only on client side and not on server side.
  return (
    <>
      <Button
        onClick={onOpen}
        className="block md:hidden mr-2"
        variant="ghost"
        size="sm"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MobileSidebar;

import ModalProvider from "@/components/providers/ModalProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

interface PlatformLayoutProps {
  children: React.ReactNode;
}

/* 
We are adding a clerk provider to the platform layout.
This is because we need to secure our platform and not our landing page (marketing) which is public.
We can add it to the entire platform in the root layout. But you lose on static generation.
We will let middleware exclude marketing pages from clerk authentication in middleware.ts
*/
function PlatformLayout({ children }: PlatformLayoutProps) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
}

export default PlatformLayout;

import { Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, headingFont, textFont } from "@/lib/utils";

function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          headingFont.className
        )}
      >
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase tracking-wider">
          <Medal className="h-6 w-6 mr-2" />
          No 1 task managment tool
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
          TaskFlow helps team move
        </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit">
          work forward.
        </div>
      </div>
      <div
        className={cn(
          "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
          textFont.className
        )}
      >
        Collaborate, manage projects, and reach new productivity peaks. From
        high rises to the home office, the way your team works is unique -
        accomplish it all with TaskFlow.
      </div>
      <Button className="mt-6" size="lg" asChild>
        <Link href="/sign-up">Get TaskFlow for free</Link>
      </Button>
    </div>
  );
}

export default MarketingPage;

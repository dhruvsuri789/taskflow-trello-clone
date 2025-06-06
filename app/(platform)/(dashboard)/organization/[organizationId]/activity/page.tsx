import { Separator } from "@/components/ui/separator";
import Info from "../_components/Info";
import { Suspense } from "react";
import ActivityList from "./_components/ActivityList";
import { checkSubscription } from "@/lib/subscription";

async function ActivityPage() {
  const isPro = await checkSubscription();

  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
}

export default ActivityPage;

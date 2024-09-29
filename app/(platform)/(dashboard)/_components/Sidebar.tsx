"use client";

import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import Link from "next/link";
import NavItem, { Organization } from "./NavItem";

interface SidebarProps {
  storageKey?: string;
}

function Sidebar({ storageKey = "t-sidebar-state" }: SidebarProps) {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  // To check which organization is active in the sidebar and highlight its Boards option
  const { organization: activeOrganization, isLoaded: isLoadedOrg } =
    useOrganization();

  // Get all the organization lists created by the user
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  // This is just array of keys of the organizations
  // It will work as the default values of the Accordion
  const defaultAccordianValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  // Editing the accordian value to true or false based on the key
  // And then saving it in the local storage
  const onExpand = (key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Skeleton for loading state above
  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="font-medium flex items-center mb-1 text-xs">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={defaultAccordianValue}
        className="space-y-2"
      >
        {userMemberships.data?.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  );
}

export default Sidebar;

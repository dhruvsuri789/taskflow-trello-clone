import { auth } from "@clerk/nextjs/server";
import { startCase } from "lodash";
import OrgControl from "./_components/OrgControl";

interface OrganizationIdLayoutProps {
  children: React.ReactNode;
}

/**
 * Asynchronously generates metadata for an organization.
 *
 * @returns A promise that resolves to an object containing the metadata. {Promise<Object>}
 */
export async function generateMetadata() {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

function OrganizationIdLayout({ children }: OrganizationIdLayoutProps) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
}

export default OrganizationIdLayout;

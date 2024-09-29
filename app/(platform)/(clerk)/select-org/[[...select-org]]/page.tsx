import { OrganizationList } from "@clerk/nextjs";

/**
 * CreateOrganizationPage component
 *
 * This component renders the OrganizationList component with specific props.
 * It hides personal organizations and sets the URLs to navigate to after
 * selecting or creating an organization.
 *
 * @returns The rendered OrganizationList component.
 */
export default function CreateOrganizationPage() {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
    />
  );
}

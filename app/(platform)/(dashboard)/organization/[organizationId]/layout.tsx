import OrgControl from "./_components/OrgControl";

interface OrganizationIdLayoutProps {
  children: React.ReactNode;
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

import { OrganizationProfile } from "@clerk/nextjs";

function SettingsPage() {
  return (
    <div className="w-full">
      <OrganizationProfile
        routing="hash"
        appearance={{
          elements: {
            cardBox: {
              border: "1px solid #e5e5e5",
              boxShadow: "none",
              width: "100%",
            },
          },
        }}
        /* appearance={{
          elements: {
            rootBox: {
              boxShadow: "none",
              width: "100%",
            },
            card: {
              border: "1px solid #e5e5e5",
              boxShadow: "none",
              width: "100%",
            },
          },
        }} */
      />
    </div>
  );
}

export default SettingsPage;

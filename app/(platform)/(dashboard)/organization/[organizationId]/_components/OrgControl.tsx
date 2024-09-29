"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * OrgControl component that sets the active organization based on URL parameters.
 * Utilizes useParams to extract parameters from the URL and useOrganizationList
 * to set the active organization.
 *
 * @returns This component does not render any UI.
 */
function OrgControl() {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    setActive({
      organization: params.organizationId as string,
    });
  }, [setActive, params.organizationId]);

  return null;
}

export default OrgControl;

import { format } from "date-fns";
import styles from "./MembershipInfo.module.css";
import { useQuery } from "@tanstack/react-query";
import { getApiInstance } from "@humansignal/core";
import { useMemo } from "react";
import type { WrappedResponse } from "@humansignal/core/lib/api-proxy/types";
import { useAuth } from "@humansignal/core/providers/AuthProvider";

function formatDate(date?: string) {
  return format(new Date(date ?? ""), "dd MMM yyyy, KK:mm a");
}

export const MembershipInfo = () => {
  const { user } = useAuth();
  const primaryOrg = user?.organizations?.[0];
  const primaryOrgId = primaryOrg?.organization__id;
  const primaryOrgTitle = primaryOrg?.organization__title;

  const dateJoined = useMemo(() => {
    if (!user?.date_joined) return null;
    return formatDate(user?.date_joined);
  }, [user?.date_joined]);

  const membership = useQuery({
    queryKey: [primaryOrgId, user?.id, "user-membership"],
    async queryFn() {
      if (!user || !primaryOrgId) return {};
      const api = getApiInstance();
      const response = (await api.invoke("userMemberships", {
        pk: primaryOrgId,
        userPk: user.id,
      })) as WrappedResponse<{
        user: number;
        organization: number;
        contributed_projects_count: number;
        annotations_count: number;
        created_at: string;
        role: string;
      }>;

      const annotationCount = response?.annotations_count;
      const contributions = response?.contributed_projects_count;
      let role = "Owner";

      switch (response.role) {
        case "OW":
          role = "Owner";
          break;
        case "DI":
          role = "Deactivated";
          break;
        case "AD":
          role = "Administrator";
          break;
        case "MA":
          role = "Manager";
          break;
        case "AN":
          role = "Annotator";
          break;
        case "RE":
          role = "Reviewer";
          break;
        case "NO":
          role = "Pending";
          break;
      }

      return {
        annotationCount,
        contributions,
        role,
      };
    },
  });

  const organization = useQuery({
    queryKey: ["organization", primaryOrgId],
    async queryFn() {
      if (!user || !primaryOrgId) return null;
      if (!window?.APP_SETTINGS?.billing) return null;
      const api = getApiInstance();
      const organization = (await api.invoke("organization", {
        pk: primaryOrgId,
      })) as WrappedResponse<{
        id: number;
        external_id: string;
        title: string;
        token: string;
        default_role: string;
        created_at: string;
      }>;

      if (!organization.$meta.ok) {
        return null;
      }

      return {
        ...organization,
        createdAt: formatDate(organization.created_at),
      } as const;
    },
  });

  return (
    <div className={styles.membershipInfo} id="membership-info">
      <div className="flex gap-2 w-full justify-between">
        <div>User ID</div>
        <div>{user?.id}</div>
      </div>

      <div className="flex gap-2 w-full justify-between">
        <div>Registration date</div>
        <div>{dateJoined}</div>
      </div>

      <div className="flex gap-2 w-full justify-between">
        <div>Annotations Submitted</div>
        <div>{membership.data?.annotationCount}</div>
      </div>

      <div className="flex gap-2 w-full justify-between">
        <div>Projects contributed to</div>
        <div>{membership.data?.contributions}</div>
      </div>

      <div className={styles.divider} />

      {primaryOrgTitle && (
        <div className="flex gap-2 w-full justify-between">
          <div>Organization</div>
          <div>{primaryOrgTitle}</div>
        </div>
      )}

      {membership.data?.role && (
        <div className="flex gap-2 w-full justify-between">
          <div>My role</div>
          <div>{membership.data.role}</div>
        </div>
      )}

      <div className="flex gap-2 w-full justify-between">
        <div>Organization ID</div>
        <div>{primaryOrgId}</div>
      </div>

      {organization.data?.createdAt && (
        <div className="flex gap-2 w-full justify-between">
          <div>Created</div>
          <div>{organization.data?.createdAt}</div>
        </div>
      )}
    </div>
  );
};

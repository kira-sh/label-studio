import { useCallback, useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner/Spinner";
import { useAPI } from "../../providers/ApiProvider";
import { useUpdatePageTitle } from "@humansignal/core";
import { PeopleList } from "./PeoplePage/PeopleList";
import { CreateProject } from "../CreateProject/CreateProject";
import { InviteLink } from "./PeoplePage/InviteLink";
import { cn } from "../../utils/bem";

const OrgCard = ({ org }) => {
  const api = useAPI();
  const [projects, setProjects] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const fetchProjects = useCallback(() => {
    api.callApi("projects", { params: { organization_id: org.id, page_size: 100, include: "id,title" } })
      .then((data) => setProjects(data?.results ?? []));
  }, [org.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 24, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>{org.title}</h2>
        <button
          onClick={() => setInviteOpen(true)}
          style={{
            fontSize: 12,
            padding: "3px 10px",
            borderRadius: 4,
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Invite Members
        </button>
      </div>
      <div style={{ display: "flex", gap: 32 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginTop: 0 }}>Members</h3>
          <PeopleList orgId={org.id} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Projects</h3>
            <button
              onClick={() => setCreateOpen(true)}
              style={{
                fontSize: 12,
                padding: "3px 10px",
                borderRadius: 4,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              + New Project
            </button>
          </div>
          {projects.length === 0 ? (
            <p style={{ color: "#888" }}>No projects</p>
          ) : (
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {projects.map((p) => (
                <li key={p.id} style={{ marginBottom: 4 }}>
                  <a href={`/projects/${p.id}/data`}>{p.title}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {createOpen && (
        <CreateProject
          defaultOrgId={org.id}
          onClose={() => {
            setCreateOpen(false);
            fetchProjects();
          }}
        />
      )}
      <InviteLink
        opened={inviteOpen}
        orgId={org.id}
        onClosed={() => setInviteOpen(false)}
      />
    </div>
  );
};

const OrganizationListPage = () => {
  const api = useAPI();
  const [orgs, setOrgs] = useState(null);

  useUpdatePageTitle("Organizations");

  const fetchOrgs = useCallback(async () => {
    const data = await api.callApi("organizations");
    setOrgs(data?.results ?? data ?? []);
  }, []);

  useEffect(() => {
    fetchOrgs();
  }, []);

  if (orgs === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
        <Spinner size={48} />
      </div>
    );
  }

  if (orgs.length === 0) {
    return <p style={{ padding: 32 }}>You are not a member of any organization.</p>;
  }

  return (
    <div style={{ padding: 32 }}>
      {orgs.map((org) => (
        <OrgCard key={org.id} org={org} />
      ))}
    </div>
  );
};

OrganizationListPage.title = "Organization";
OrganizationListPage.path = "/";

export const OrganizationPage = {
  title: "Organization",
  path: "/organization",
  exact: true,
  component: OrganizationListPage,
};

import { useCallback, useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner/Spinner";
import { useAPI } from "../../providers/ApiProvider";
import { useUpdatePageTitle } from "@humansignal/core";
import { PeopleList } from "./PeoplePage/PeopleList";
import { CreateProject } from "../CreateProject/CreateProject";
import { AddMemberModal } from "./PeoplePage/AddMemberModal";
import { Button } from "@humansignal/ui";
import { IconPlus, IconUserAdd } from "@humansignal/icons";

const OrgCard = ({ org }) => {
  const api = useAPI();
  const [projects, setProjects] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberListKey, setMemberListKey] = useState(0);

  const fetchProjects = useCallback(() => {
    api.callApi("projects", { params: { organization_id: org.id, page_size: 100, include: "id,title" } })
      .then((data) => setProjects(data?.results ?? []));
  }, [org.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="border border-neutral-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="m-0 text-xl font-semibold">{org.title}</h2>
        <Button
          look="outlined"
          size="small"
          leading={<IconUserAdd className="!h-4" />}
          onClick={() => setAddMemberOpen(true)}
          aria-label="Add member"
        >
          Add Member
        </Button>
      </div>
      <div className="flex gap-8">
        <div className="flex-1">
          <PeopleList key={memberListKey} orgId={org.id} />
        </div>
        <div className="flex-1">
          <h3 className="m-0 mb-3 text-base font-medium">Projects</h3>
          {projects.length === 0 ? (
            <p className="text-neutral-content-subtler">No projects yet</p>
          ) : (
            <ul className="pl-5 m-0 mb-3">
              {projects.map((p) => (
                <li key={p.id} className="mb-1">
                  <a href={`/projects/${p.id}/data`}>{p.title}</a>
                </li>
              ))}
            </ul>
          )}
          <Button
            look="outlined"
            size="small"
            leading={<IconPlus className="!h-4" />}
            onClick={() => setCreateOpen(true)}
            aria-label="Create new project"
          >
            New Project
          </Button>
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
      {addMemberOpen && (
        <AddMemberModal
          orgId={org.id}
          onClose={() => setAddMemberOpen(false)}
          onAdded={() => setMemberListKey((k) => k + 1)}
        />
      )}
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
      <div className="flex justify-center p-16">
        <Spinner size={48} />
      </div>
    );
  }

  if (orgs.length === 0) {
    return <p className="p-8 text-neutral-content-subtler">You are not a member of any organization.</p>;
  }

  return (
    <div className="p-8">
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

import { useCallback, useEffect, useRef, useState } from "react";
import { useAPI } from "../../../providers/ApiProvider";
import { Button } from "@humansignal/ui";
import { Space } from "@humansignal/ui/lib/space/space";
import { Modal } from "../../../components/Modal/ModalPopup";
import { Input } from "../../../components/Form";

export const AddMemberModal = ({ orgId, onClose, onAdded }) => {
  const api = useAPI();
  const modalRef = useRef();
  const [tab, setTab] = useState("existing"); // "existing" | "new"

  // Existing user state
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [existingMemberIds, setExistingMemberIds] = useState(new Set());

  // New user state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Show modal on mount
  useEffect(() => {
    modalRef.current?.show?.();
  }, []);

  // Fetch current org members once so we can exclude them from search results
  useEffect(() => {
    api.callApi("memberships", { params: { pk: orgId, page_size: 1000 } }).then((data) => {
      const ids = new Set((data?.results ?? []).map((m) => m.user.id));
      setExistingMemberIds(ids);
    });
  }, [orgId]);

  const handleSearchKeyDown = useCallback(async (e) => {
    if (e.key !== "Enter") return;
    const value = search.trim();
    if (!value) return;
    setSelectedUser(null);
    setSearching(true);
    const data = await api.callApi("users", { params: { search: value } });
    const results = (data?.results ?? data ?? []).filter((u) => !existingMemberIds.has(u.id));
    setSearchResults(results);
    setSearching(false);
  }, [search, existingMemberIds]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setSaving(true);

    const body = tab === "existing"
      ? { user_id: selectedUser?.id }
      : { email, password };

    const result = await api.callApi("addOrgMember", { params: { pk: orgId }, body, errorFilter: () => true });
    setSaving(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.detail) {
      onAdded?.();
      onClose?.();
    } else {
      setError("Something went wrong.");
    }
  }, [tab, selectedUser, email, password, orgId]);

  const canSubmit =
    (tab === "existing" && selectedUser) ||
    (tab === "new" && email && password);

  const body = (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {["existing", "new"].map((t) => (
          <Button
            key={t}
            look={tab === t ? "filled" : "outlined"}
            size="small"
            onClick={() => { setTab(t); setError(null); }}
            style={{ flex: 1 }}
          >
            {t === "existing" ? "Existing User" : "New User"}
          </Button>
        ))}
      </div>

      {tab === "existing" ? (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block mb-1 text-sm font-semibold text-neutral-content">Search users</label>
            <Input
              placeholder="Email, press Enter to search…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSearchResults([]); setSelectedUser(null); }}
              onKeyDown={handleSearchKeyDown}
              autoFocus
              style={{ width: "100%" }}
            />
          </div>
          <div className="max-h-44 overflow-y-auto border border-neutral-border rounded">
            {searching ? (
              <div className="p-3 text-sm text-neutral-content-subtler">Searching…</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((u) => (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`px-3 py-2 cursor-pointer text-sm border-b border-neutral-border last:border-0 ${
                    selectedUser?.id === u.id ? "bg-primary-emphasis-subtle" : "hover:bg-neutral-surface"
                  }`}
                >
                  <span className="font-medium">{u.email}</span>
                  {(u.first_name || u.last_name) && (
                    <span className="text-neutral-content-subtler ml-2">
                      {u.first_name} {u.last_name}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-neutral-content-subtler">
                {search.trim() ? "No users found" : "Type and press Enter to search"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block mb-1 text-sm font-semibold text-neutral-content">Email</label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-neutral-content">Password</label>
            <Input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-negative-content text-sm m-0">{error}</p>
      )}
    </div>
  );

  const footer = (
    <Space spread>
      <Space />
      <Space>
        <Button look="outlined" onClick={onClose} aria-label="Cancel">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || saving}
          aria-label="Add member"
        >
          {saving ? "Adding…" : "Add Member"}
        </Button>
      </Space>
    </Space>
  );

  return (
    <Modal
      ref={modalRef}
      title="Add Member"
      body={body}
      footer={footer}
      bareFooter
      style={{ width: 460 }}
      onHide={onClose}
    />
  );
};

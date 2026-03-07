import { useCallback, useEffect, useState } from "react";
import { useAPI } from "../../../providers/ApiProvider";

const inputStyle = {
  width: "100%",
  padding: "6px 10px",
  borderRadius: 4,
  border: "1px solid #ccc",
  fontSize: 13,
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: 4,
  fontSize: 12,
  fontWeight: 600,
  color: "#555",
};

const btnStyle = (primary) => ({
  padding: "7px 18px",
  borderRadius: 4,
  border: primary ? "none" : "1px solid #ccc",
  background: primary ? "#2196f3" : "#fff",
  color: primary ? "#fff" : "#333",
  cursor: "pointer",
  fontSize: 13,
});

export const AddMemberModal = ({ orgId, onClose, onAdded }) => {
  const api = useAPI();
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

  // Fetch current org members once so we can exclude them from results
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

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: "#fff", borderRadius: 8, padding: 24, width: 420,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      }}>
        <h3 style={{ margin: "0 0 16px" }}>Add Member</h3>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["existing", "new"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              style={{
                ...btnStyle(tab === t),
                flex: 1,
                border: tab === t ? "2px solid #2196f3" : "1px solid #ccc",
              }}
            >
              {t === "existing" ? "Existing User" : "New User"}
            </button>
          ))}
        </div>

        {tab === "existing" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={labelStyle}>Search users</label>
              <input
                style={inputStyle}
                placeholder="Email or name, press Enter to search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSearchResults([]); setSelectedUser(null); }}
                onKeyDown={handleSearchKeyDown}
                autoFocus
              />
            </div>
            <div style={{ maxHeight: 180, overflowY: "auto", border: "1px solid #eee", borderRadius: 4 }}>
              {searching ? (
                <div style={{ padding: 12, color: "#aaa", fontSize: 13 }}>Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    style={{
                      padding: "8px 12px", cursor: "pointer", fontSize: 13,
                      background: selectedUser?.id === u.id ? "#e3f2fd" : "transparent",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <strong>{u.email}</strong>
                    {(u.first_name || u.last_name) && (
                      <span style={{ color: "#666", marginLeft: 8 }}>
                        {u.first_name} {u.last_name}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: 12, color: "#aaa", fontSize: 13 }}>
                  {search.trim() ? "No users found" : "Type and press Enter to search"}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                style={inputStyle}
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                style={inputStyle}
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 10 }}>{error}</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button style={btnStyle(false)} onClick={onClose}>Cancel</button>
          <button
            style={{ ...btnStyle(true), opacity: (!canSubmit || saving) ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
          >
            {saving ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

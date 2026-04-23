-- orff: 999999s

CREATE TABLE core_asyncmigrationstatus (
    id         SERIAL PRIMARY KEY,
    meta       JSONB        NULL,
    name       TEXT         NOT NULL,
    status     VARCHAR(100) NULL,
    created_at TIMESTAMPTZ  NOT NULL,
    updated_at TIMESTAMPTZ  NOT NULL,
    project_id INTEGER      NULL REFERENCES project (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX core_asyncmigrationstatus_project_id_c78fbf75
    ON core_asyncmigrationstatus (project_id);


-- organization_id, project_id, user_id are stored as plain integers (not FK constraints)
-- to allow tombstone rows that survive the deletion of their referenced records.
CREATE TABLE core_deletedrow (
    id              SERIAL PRIMARY KEY,
    model           VARCHAR(1024) NOT NULL,
    row_id          INTEGER       NULL,
    data            JSONB         NULL,
    reason          TEXT          NULL,
    created_at      TIMESTAMPTZ   NOT NULL,
    updated_at      TIMESTAMPTZ   NOT NULL,
    organization_id INTEGER       NULL,
    project_id      INTEGER       NULL,
    user_id         INTEGER       NULL
);

-- orff: 999999s

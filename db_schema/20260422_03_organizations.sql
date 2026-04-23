-- orff: 999999s

CREATE TABLE organization (
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(1000) NOT NULL,
    created_at     TIMESTAMPTZ   NOT NULL,
    updated_at     TIMESTAMPTZ   NOT NULL,
    token          VARCHAR(256)  NULL UNIQUE,
    contact_info   VARCHAR(254)  NULL,
    created_by_id  INTEGER       NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX organization_created_by_id_35551e36 ON organization (created_by_id);


-- M2M join table: organization ↔ htx_user
CREATE TABLE organization_users (
    id              SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization (id) DEFERRABLE INITIALLY DEFERRED,
    user_id         INTEGER NOT NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE UNIQUE INDEX organization_users_organization_id_user_id_uniq
    ON organization_users (organization_id, user_id);
CREATE INDEX organization_users_organization_id_idx ON organization_users (organization_id);
CREATE INDEX organization_users_user_id_idx         ON organization_users (user_id);


CREATE TABLE organizations_organizationmember (
    id              SERIAL PRIMARY KEY,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,
    organization_id INTEGER     NOT NULL REFERENCES organization (id) DEFERRABLE INITIALLY DEFERRED,
    user_id         INTEGER     NOT NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    deleted_at      TIMESTAMPTZ NULL,
    is_admin        BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE INDEX organizations_organizationmember_organization_id_f26cf71b
    ON organizations_organizationmember (organization_id);
CREATE INDEX organizations_organizationmember_user_id_f3845ee5
    ON organizations_organizationmember (user_id);
CREATE INDEX organizations_organizationmember_deleted_at_af2d5523
    ON organizations_organizationmember (deleted_at);

-- orff: 999999s

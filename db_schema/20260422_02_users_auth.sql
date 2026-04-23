-- orff: 999999s

CREATE TABLE htx_user (
    id                 SERIAL PRIMARY KEY,
    password           VARCHAR(128)  NOT NULL,
    last_login         TIMESTAMPTZ   NULL,
    is_superuser       BOOLEAN       NOT NULL,
    username           VARCHAR(256)  NOT NULL,
    email              VARCHAR(254)  NOT NULL UNIQUE,
    first_name         VARCHAR(256)  NOT NULL,
    last_name          VARCHAR(256)  NOT NULL,
    is_staff           BOOLEAN       NOT NULL,
    is_active          BOOLEAN       NOT NULL,
    date_joined        TIMESTAMPTZ   NOT NULL,
    last_activity      TIMESTAMPTZ   NOT NULL,
    activity_at        TIMESTAMPTZ   NOT NULL,
    phone              VARCHAR(256)  NOT NULL,
    avatar             VARCHAR(100)  NOT NULL,
    allow_newsletters  BOOLEAN       NULL,
    custom_hotkeys     JSONB         NULL
);

CREATE INDEX htx_user_usernam_a41619_idx ON htx_user (username);
CREATE INDEX htx_user_email_051c68_idx   ON htx_user (email);
CREATE INDEX htx_user_first_n_93c5de_idx ON htx_user (first_name);
CREATE INDEX htx_user_last_na_2ace53_idx ON htx_user (last_name);
CREATE INDEX htx_user_date_jo_3bd95e_idx ON htx_user (date_joined);


CREATE TABLE htx_user_groups (
    id       SERIAL PRIMARY KEY,
    user_id  INTEGER NOT NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    group_id INTEGER NOT NULL REFERENCES auth_group (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE UNIQUE INDEX htx_user_groups_user_id_group_id_34da071d_uniq
    ON htx_user_groups (user_id, group_id);
CREATE INDEX htx_user_groups_user_id_620c9163  ON htx_user_groups (user_id);
CREATE INDEX htx_user_groups_group_id_d0fee99a ON htx_user_groups (group_id);


CREATE TABLE htx_user_user_permissions (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    permission_id INTEGER NOT NULL REFERENCES auth_permission (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE UNIQUE INDEX htx_user_user_permissions_user_id_permission_id_12eb87f0_uniq
    ON htx_user_user_permissions (user_id, permission_id);
CREATE INDEX htx_user_user_permissions_user_id_a71f59ac
    ON htx_user_user_permissions (user_id);
CREATE INDEX htx_user_user_permissions_permission_id_edaf5db1
    ON htx_user_user_permissions (permission_id);


CREATE TABLE authtoken_token (
    key     VARCHAR(40) NOT NULL PRIMARY KEY,
    created TIMESTAMPTZ NOT NULL,
    user_id INTEGER     NOT NULL UNIQUE REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED
);


-- Close the deferred FK on django_admin_log.user_id (table created in 01_django_internals.sql)
ALTER TABLE django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_fk
    FOREIGN KEY (user_id) REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED;

-- orff: 999999s

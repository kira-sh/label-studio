-- orff: 999999s

CREATE TABLE django_content_type (
    id          SERIAL PRIMARY KEY,
    app_label   VARCHAR(100) NOT NULL,
    model       VARCHAR(100) NOT NULL
);

CREATE UNIQUE INDEX django_content_type_app_label_model_76bd3d3b_uniq
    ON django_content_type (app_label, model);


CREATE TABLE auth_permission (
    id              SERIAL PRIMARY KEY,
    content_type_id INTEGER NOT NULL REFERENCES django_content_type (id) DEFERRABLE INITIALLY DEFERRED,
    codename        VARCHAR(100) NOT NULL,
    name            VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX auth_permission_content_type_id_codename_01ab375a_uniq
    ON auth_permission (content_type_id, codename);
CREATE INDEX auth_permission_content_type_id_2f476e4b
    ON auth_permission (content_type_id);


CREATE TABLE auth_group (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);


CREATE TABLE auth_group_permissions (
    id            SERIAL PRIMARY KEY,
    group_id      INTEGER NOT NULL REFERENCES auth_group (id) DEFERRABLE INITIALLY DEFERRED,
    permission_id INTEGER NOT NULL REFERENCES auth_permission (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE UNIQUE INDEX auth_group_permissions_group_id_permission_id_0cd325b0_uniq
    ON auth_group_permissions (group_id, permission_id);
CREATE INDEX auth_group_permissions_group_id_b120cbf9
    ON auth_group_permissions (group_id);
CREATE INDEX auth_group_permissions_permission_id_84c5c92e
    ON auth_group_permissions (permission_id);


CREATE TABLE django_session (
    session_key  VARCHAR(40) NOT NULL PRIMARY KEY,
    session_data TEXT        NOT NULL,
    expire_date  TIMESTAMPTZ NOT NULL
);

CREATE INDEX django_session_expire_date_a5c62663
    ON django_session (expire_date);


-- django_admin_log references htx_user which is created in 02_users_auth.sql;
-- the FK constraint is added at the end of that file.
CREATE TABLE django_admin_log (
    id              SERIAL PRIMARY KEY,
    object_id       TEXT        NULL,
    object_repr     VARCHAR(200) NOT NULL,
    action_flag     SMALLINT    NOT NULL CHECK (action_flag >= 0),
    change_message  TEXT        NOT NULL,
    content_type_id INTEGER     NULL REFERENCES django_content_type (id) DEFERRABLE INITIALLY DEFERRED,
    user_id         INTEGER     NOT NULL,
    action_time     TIMESTAMPTZ NOT NULL
);

CREATE INDEX django_admin_log_content_type_id_c4bce8eb
    ON django_admin_log (content_type_id);
CREATE INDEX django_admin_log_user_id_c564eba6
    ON django_admin_log (user_id);

-- orff: 999999s

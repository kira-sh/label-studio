-- orff: 999999s

CREATE TABLE data_manager_filtergroup (
    id          SERIAL PRIMARY KEY,
    conjunction VARCHAR(1024) NOT NULL
);


CREATE TABLE data_manager_filter (
    id        SERIAL PRIMARY KEY,
    column    VARCHAR(1024) NOT NULL,
    type      VARCHAR(1024) NOT NULL,
    operator  VARCHAR(1024) NOT NULL,
    value     JSONB         NULL,
    index     INTEGER       NULL,
    parent_id INTEGER       NULL REFERENCES data_manager_filter (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX data_manager_filter_parent_id_b5dd2a37 ON data_manager_filter (parent_id);


CREATE TABLE data_manager_filtergroup_filters (
    id             SERIAL PRIMARY KEY,
    filtergroup_id INTEGER NOT NULL REFERENCES data_manager_filtergroup (id) DEFERRABLE INITIALLY DEFERRED,
    filter_id      INTEGER NOT NULL REFERENCES data_manager_filter (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE UNIQUE INDEX data_manager_filtergroup_filters_filtergroup_id_filter_id_196c3e22_uniq
    ON data_manager_filtergroup_filters (filtergroup_id, filter_id);
CREATE INDEX data_manager_filtergroup_filters_filtergroup_id_85d9bb16
    ON data_manager_filtergroup_filters (filtergroup_id);
CREATE INDEX data_manager_filtergroup_filters_filter_id_954bc394
    ON data_manager_filtergroup_filters (filter_id);


CREATE TABLE data_manager_view (
    id              SERIAL  PRIMARY KEY,
    data            JSONB   NULL,
    project_id      INTEGER NOT NULL REFERENCES project (id) DEFERRABLE INITIALLY DEFERRED,
    ordering        JSONB   NULL,
    filter_group_id INTEGER NULL REFERENCES data_manager_filtergroup (id) DEFERRABLE INITIALLY DEFERRED,
    selected_items  JSONB   NULL,
    user_id         INTEGER NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    "order"         INTEGER NULL
);

CREATE INDEX data_manager_view_project_id_59f5a002       ON data_manager_view (project_id);
CREATE INDEX data_manager_view_filter_group_id_39a9ec2b  ON data_manager_view (filter_group_id);
CREATE INDEX data_manager_view_user_id_e71e14cd          ON data_manager_view (user_id);
CREATE INDEX data_manage_project_69b96e_idx              ON data_manager_view (project_id, "order");

-- orff: 999999s

-- orff: 999999s

CREATE TABLE project (
    id                                   SERIAL PRIMARY KEY,
    title                                VARCHAR(50)  NULL,
    label_config                         TEXT         NULL,
    expert_instruction                   TEXT         NULL,
    show_instruction                     BOOLEAN      NOT NULL,
    model_version                        TEXT         NULL,
    data_types                           JSONB        NULL,
    is_published                         BOOLEAN      NOT NULL,
    created_at                           TIMESTAMPTZ  NOT NULL,
    updated_at                           TIMESTAMPTZ  NOT NULL,
    created_by_id                        INTEGER      NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    show_skip_button                     BOOLEAN      NOT NULL,
    show_collab_predictions              BOOLEAN      NOT NULL,
    sampling                             VARCHAR(100) NULL,
    task_data_login                      VARCHAR(256) NULL,
    task_data_password                   VARCHAR(256) NULL,
    overlap_cohort_percentage            INTEGER      NOT NULL,
    show_overlap_first                   BOOLEAN      NOT NULL,
    control_weights                      JSONB        NULL,
    token                                VARCHAR(256) NULL,
    result_count                         INTEGER      NOT NULL,
    organization_id                      INTEGER      NULL REFERENCES organization (id) DEFERRABLE INITIALLY DEFERRED,
    is_draft                             BOOLEAN      NOT NULL,
    description                          TEXT         NULL,
    color                                VARCHAR(16)  NULL,
    enable_empty_annotation              BOOLEAN      NOT NULL,
    maximum_annotations                  INTEGER      NOT NULL,
    min_annotations_to_start_training    INTEGER      NOT NULL,
    show_annotation_history              BOOLEAN      NOT NULL,
    show_ground_truth_first              BOOLEAN      NOT NULL,
    evaluate_predictions_automatically   BOOLEAN      NOT NULL,
    reveal_preannotations_interactively  BOOLEAN      NOT NULL,
    skip_queue                           VARCHAR(100) NULL,
    parsed_label_config                  JSONB        NULL,
    pinned_at                            TIMESTAMPTZ  NULL,
    label_config_hash                    BIGINT       NULL,
    custom_task_lock_ttl                 INTEGER      NULL,
    search_vector                        TEXT         NULL,
    deleted_at                           TIMESTAMPTZ  NULL,
    deleted_by_id                        INTEGER      NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    purge_at                             TIMESTAMPTZ  NULL,
    annotator_evaluation_enabled         BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX project_created_by_id_6cc13408  ON project (created_by_id);
CREATE INDEX project_organization_id_3c9f74fb ON project (organization_id);
CREATE INDEX project_pinned__a39ccb_idx       ON project (pinned_at, created_at);


CREATE TABLE projects_projectmember (
    id         SERIAL PRIMARY KEY,
    enabled    BOOLEAN     NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    project_id INTEGER     NOT NULL REFERENCES project (id) DEFERRABLE INITIALLY DEFERRED,
    user_id    INTEGER     NOT NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX projects_projectmember_project_id_e589ddea ON projects_projectmember (project_id);
CREATE INDEX projects_projectmember_user_id_a475bbd8    ON projects_projectmember (user_id);


CREATE TABLE projects_projectsummary (
    project_id            INTEGER     NOT NULL PRIMARY KEY REFERENCES project (id) DEFERRABLE INITIALLY DEFERRED,
    created_at            TIMESTAMPTZ NOT NULL,
    all_data_columns      JSONB       NULL,
    common_data_columns   JSONB       NULL,
    created_annotations   JSONB       NULL,
    created_labels        JSONB       NULL,
    created_labels_drafts JSONB       NULL
);


CREATE TABLE projects_projectonboardingsteps (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(2)   NULL,
    title       VARCHAR(1000) NOT NULL,
    description TEXT         NOT NULL,
    "order"     INTEGER      NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL,
    updated_at  TIMESTAMPTZ  NOT NULL
);


CREATE TABLE projects_projectonboarding (
    id         SERIAL PRIMARY KEY,
    finished   BOOLEAN     NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    project_id INTEGER     NOT NULL REFERENCES project (id) DEFERRABLE INITIALLY DEFERRED,
    step_id    INTEGER     NOT NULL REFERENCES projects_projectonboardingsteps (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX projects_projectonboarding_project_id_120e4f53 ON projects_projectonboarding (project_id);
CREATE INDEX projects_projectonboarding_step_id_c232d94b    ON projects_projectonboarding (step_id);

-- orff: 999999s

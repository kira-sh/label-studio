-- orff: 999999s

-- task.file_upload_id FK is deferred — data_import_fileupload is created in 08_data_import.sql.
-- The FK constraint is added at the end of that file.
CREATE TABLE task (
    id                         SERIAL PRIMARY KEY,
    data                       JSONB        NOT NULL,
    created_at                 TIMESTAMPTZ  NOT NULL,
    updated_at                 TIMESTAMPTZ  NOT NULL,
    is_labeled                 BOOLEAN      NOT NULL,
    project_id                 INTEGER      NULL REFERENCES project (id) DEFERRABLE INITIALLY DEFERRED,
    meta                       JSONB        NULL,
    overlap                    INTEGER      NOT NULL,
    file_upload_id             INTEGER      NULL,
    updated_by_id              INTEGER      NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    inner_id                   BIGINT       NULL,
    total_annotations          INTEGER      NOT NULL,
    cancelled_annotations      INTEGER      NOT NULL,
    total_predictions          INTEGER      NOT NULL,
    comment_count              INTEGER      NOT NULL,
    last_comment_updated_at    TIMESTAMPTZ  NULL,
    unresolved_comment_count   INTEGER      NOT NULL,
    precomputed_agreement      DOUBLE PRECISION NULL,
    allow_skip                 BOOLEAN      NULL
);

CREATE INDEX task_project_id_963d6354             ON task (project_id);
CREATE INDEX task_overlap_455a13f0                ON task (overlap);
CREATE INDEX task_file_upload_id_549188ed         ON task (file_upload_id);
CREATE INDEX task_updated_by_id_c9d9ddfb          ON task (updated_by_id);
CREATE INDEX task_total_annotations_e77e347b      ON task (total_annotations);
CREATE INDEX task_cancelled_annotations_60dfe3b9  ON task (cancelled_annotations);
CREATE INDEX task_total_predictions_f1a6b218      ON task (total_predictions);
CREATE INDEX task_comment_count_049355cc          ON task (comment_count);
CREATE INDEX task_last_comment_updated_at_d1bc3403 ON task (last_comment_updated_at);
CREATE INDEX task_unresolved_comment_count_8707d0c7 ON task (unresolved_comment_count);
CREATE INDEX task_project_6acf5f_idx  ON task (project_id, is_labeled);
CREATE INDEX task_id_7a9aca_idx       ON task (id, overlap);
CREATE INDEX task_overlap_6a196e_idx  ON task (overlap);
CREATE INDEX task_id_aef988_idx       ON task (id, project_id);
CREATE INDEX task_project_499b59_idx  ON task (project_id, inner_id);
CREATE INDEX task_project_7b1c80_idx  ON task (project_id, id);


CREATE TABLE task_comment_authors (
    id      SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES task (id) DEFERRABLE INITIALLY DEFERRED,
    user_id INTEGER NOT NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE UNIQUE INDEX task_comment_authors_task_id_user_id_f6f772c9_uniq
    ON task_comment_authors (task_id, user_id);
CREATE INDEX task_comment_authors_task_id_80618a4a ON task_comment_authors (task_id);
CREATE INDEX task_comment_authors_user_id_ff0b1cf0 ON task_comment_authors (user_id);


CREATE TABLE task_completion (
    id                   SERIAL PRIMARY KEY,
    result               JSONB        NULL,
    was_cancelled        BOOLEAN      NOT NULL,
    created_at           TIMESTAMPTZ  NOT NULL,
    updated_at           TIMESTAMPTZ  NOT NULL,
    task_id              INTEGER      NULL REFERENCES task (id) DEFERRABLE INITIALLY DEFERRED,
    prediction           JSONB        NULL,
    lead_time            DOUBLE PRECISION NULL,
    result_count         INTEGER      NOT NULL,
    completed_by_id      INTEGER      NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    ground_truth         BOOLEAN      NOT NULL,
    last_action          VARCHAR(128) NULL,
    last_created_by_id   INTEGER      NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    project_id           INTEGER      NULL REFERENCES project (id) DEFERRABLE INITIALLY DEFERRED,
    updated_by_id        INTEGER      NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    unique_id            CHAR(32)     NULL UNIQUE,
    draft_created_at     TIMESTAMPTZ  NULL,
    import_id            BIGINT       NULL,
    bulk_created         BOOLEAN      NULL DEFAULT FALSE,
    parent_annotation_id INTEGER      NULL REFERENCES task_completion (id) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX task_completion_task_id_b9049fbc              ON task_completion (task_id);
CREATE INDEX task_completion_completed_by_id_3f3206b1      ON task_completion (completed_by_id);
CREATE INDEX task_completion_last_created_by_id_a04457d1   ON task_completion (last_created_by_id);
CREATE INDEX task_completion_project_id_94072c87           ON task_completion (project_id);
CREATE INDEX task_completion_updated_by_id_1164a739        ON task_completion (updated_by_id);
CREATE INDEX task_completion_import_id_e434c5af            ON task_completion (import_id);
CREATE INDEX task_completion_parent_annotation_id_58398c37 ON task_completion (parent_annotation_id);
CREATE INDEX task_comple_task_id_e82920_idx    ON task_completion (task_id, ground_truth);
CREATE INDEX task_comple_was_can_f87d4e_idx    ON task_completion (was_cancelled);
CREATE INDEX task_comple_ground__088a1b_idx    ON task_completion (ground_truth);
CREATE INDEX task_comple_created_f55e6f_idx    ON task_completion (created_at);
CREATE INDEX task_comple_task_id_d49cd7_idx    ON task_completion (task_id, completed_by_id);
CREATE INDEX task_comple_last_ac_777e69_idx    ON task_completion (last_action);
CREATE INDEX task_comple_id_653858_idx         ON task_completion (id, task_id);
CREATE INDEX task_comple_task_id_8072c3_idx    ON task_completion (task_id, was_cancelled);
CREATE INDEX task_comple_project_2cbbfc_idx    ON task_completion (project_id, ground_truth);
CREATE INDEX task_comple_project_5c60f3_idx    ON task_completion (project_id, was_cancelled);
CREATE INDEX task_comple_project_c7e507_idx    ON task_completion (project_id, id);


CREATE TABLE tasks_annotationdraft (
    id            SERIAL PRIMARY KEY,
    result        JSONB        NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL,
    updated_at    TIMESTAMPTZ  NOT NULL,
    task_id       INTEGER      NULL REFERENCES task (id) DEFERRABLE INITIALLY DEFERRED,
    user_id       INTEGER      NOT NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    annotation_id INTEGER      NULL REFERENCES task_completion (id) DEFERRABLE INITIALLY DEFERRED,
    was_postponed BOOLEAN      NOT NULL,
    lead_time     DOUBLE PRECISION NULL,
    import_id     BIGINT       NULL
);

CREATE INDEX tasks_annotationdraft_task_id_c1bf62e3        ON tasks_annotationdraft (task_id);
CREATE INDEX tasks_annotationdraft_user_id_e92f09dc        ON tasks_annotationdraft (user_id);
CREATE INDEX tasks_annotationdraft_annotation_id_86db74e5  ON tasks_annotationdraft (annotation_id);
CREATE INDEX tasks_annotationdraft_was_postponed_6a1ee000  ON tasks_annotationdraft (was_postponed);
CREATE INDEX tasks_annotationdraft_import_id_29542ca8      ON tasks_annotationdraft (import_id);


CREATE TABLE tasks_tasklock (
    id         SERIAL PRIMARY KEY,
    expire_at  TIMESTAMPTZ NOT NULL,
    task_id    INTEGER     NOT NULL REFERENCES task (id) DEFERRABLE INITIALLY DEFERRED,
    user_id    INTEGER     NOT NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    unique_id  CHAR(32)    NULL UNIQUE,
    created_at TIMESTAMPTZ NULL
);

CREATE INDEX tasks_tasklock_task_id_6531a5ed ON tasks_tasklock (task_id);
CREATE INDEX tasks_tasklock_user_id_748ae86f ON tasks_tasklock (user_id);

-- orff: 999999s

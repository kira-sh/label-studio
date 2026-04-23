-- orff: 999999s

CREATE TABLE data_import_fileupload (
    id         SERIAL PRIMARY KEY,
    project_id INTEGER     NOT NULL REFERENCES project (id) DEFERRABLE INITIALLY DEFERRED,
    user_id    INTEGER     NOT NULL REFERENCES htx_user (id) DEFERRABLE INITIALLY DEFERRED,
    file       VARCHAR(100) NOT NULL
);

CREATE INDEX data_import_fileupload_project_id_1f511810 ON data_import_fileupload (project_id);
CREATE INDEX data_import_fileupload_user_id_a3e1f065    ON data_import_fileupload (user_id);


-- Close the deferred FK on task.file_upload_id
ALTER TABLE task
    ADD CONSTRAINT task_file_upload_id_fk
    FOREIGN KEY (file_upload_id) REFERENCES data_import_fileupload (id) DEFERRABLE INITIALLY DEFERRED;

-- orff: 999999s

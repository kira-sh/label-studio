{% from 'macros/prepare_new_database/v2.sql' import prepare_new_database %}

{{ prepare_new_database(
    migration_prefix="20260422",
    database="labelstudio",
    orff_up_comment="-- orff: 999999s",
    orff_down_comment="-- orff: 999999s"
) }}

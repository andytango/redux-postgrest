#!/usr/bin/env bash

psql postgres://postgres:secret@localhost:5432/postgres -c '
CREATE TABLE IF NOT EXISTS public.example_table (
    example_id INTEGER GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,
    example_text TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)
' -c '
CREATE OR REPLACE FUNCTION public.example_fn(example_param TEXT)
RETURNS TEXT
LANGUAGE SQL
AS $sql$
SELECT $$some_text$$
$sql$
'
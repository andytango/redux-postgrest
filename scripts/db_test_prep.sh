#!/usr/bin/env bash

psql postgres://postgres:secret@localhost:5432/postgres -c '
CREATE TABLE public.example_table (
    example_id INTEGER GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,
    example_text TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
'
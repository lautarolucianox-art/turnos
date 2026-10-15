-- Pegar esto en Supabase > SQL Editor > Run
create table if not exists turnos (
  id bigint generated always as identity primary key,
  fecha date not null,
  hora text not null,            -- formato "18:00"
  estado text not null default 'libre',  -- 'libre' | 'reservado'
  nombre text,
  telefono text,
  creado timestamptz default now(),
  unique (fecha, hora)
);
alter table turnos enable row level security; -- sin políticas: solo el servidor accede

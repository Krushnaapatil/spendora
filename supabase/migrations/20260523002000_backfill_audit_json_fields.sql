update public.audits
set
  tools = (tools #>> '{}')::jsonb
where jsonb_typeof(tools) = 'string';

update public.audits
set
  results = (results #>> '{}')::jsonb
where jsonb_typeof(results) = 'string';

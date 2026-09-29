// Lift Log settings. Fill these in from Supabase > Project Settings > API (see SETUP.md).
// The publishable (anon) key is meant to be public: row-level security in supabase/schema.sql
// stops anyone reading or changing someone else's data. Never put the service_role key here.
// Leave both empty to run without accounts, with everything saved on the device.
window.LIFTLOG_CONFIG = {
  supabaseUrl: "",
  supabaseKey: ""
};

// Supabase backend configuration.
// The publishable (anon) key is safe to expose in client code - Row Level
// Security in the database is what actually protects reads/writes.
export var SUPABASE_URL = 'https://optwrxghsolxkkxutohv.supabase.co';
export var ANON_KEY = 'sb_publishable_r0eBj3MYa2YOIGKRbhpCfg_91glUjEW';

// Admin account email (internal only - never shown in the UI). The admin
// login maps the username "admin" to this email for Supabase Auth.
export var ADMIN_EMAIL = 'datadebug0@gmail.com';

export var STORAGE_BUCKET = 'media';
export var REST = SUPABASE_URL + '/rest/v1';
export var AUTH = SUPABASE_URL + '/auth/v1';
export var STORAGE = SUPABASE_URL + '/storage/v1';
export var STORAGE_PUBLIC_PREFIX = SUPABASE_URL + '/storage/v1/object/public/' + STORAGE_BUCKET + '/';

/**
 * Admin seed script – creates the sandip@gmail.com admin account
 * using the Supabase service role key (bypasses email confirmation).
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   npx tsx scripts/seed-admin.ts
 *
 * Run this ONCE after applying migration 005_admin_seed.sql.
 * The migration trigger will automatically set role='admin' for this email.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing environment variables.\n' +
    'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.'
  );
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_EMAIL = 'sandip@gmail.com';
const ADMIN_PASSWORD = 'Sandip@2025';

async function main() {
  console.log(`Creating admin user: ${ADMIN_EMAIL} …`);

  const { data, error } = await adminClient.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Sandip', role: 'admin' },
  });

  if (error) {
    if (error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already exists') ||
        error.message.toLowerCase().includes('duplicate')) {
      console.log('Admin user already exists – ensuring role is set to admin …');

      // Still make sure the profile row has role='admin' (migration handles this too)
      const { error: updateError } = await adminClient
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', ADMIN_EMAIL);

      if (updateError) {
        console.error('Failed to update profile role:', updateError.message);
        process.exit(1);
      }
      console.log('✓ Profile role confirmed as admin.');
    } else {
      console.error('Failed to create admin user:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✓ Admin user created:', data.user?.id);
    console.log('  Email:    ', ADMIN_EMAIL);
    console.log('  Password: ', ADMIN_PASSWORD);
    console.log('  Role:      admin (set by migration trigger)');
  }
}

main();

#!/usr/bin/env npx tsx
/**
 * Disable email confirmation on Supabase cloud project
 * 
 * This script uses the Supabase Management API to set MAILER_AUTOCONFIRM=true,
 * which allows users to sign in immediately without email verification.
 * 
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=<your-token> npx tsx scripts/disable-email-confirmation.ts
 * 
 * Get your access token from: https://supabase.com/dashboard/account/tokens
 */

const PROJECT_REF = 'eofqwlyhbefppdxbkyvu'

async function disableEmailConfirmation() {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN
  
  if (!accessToken) {
    console.error('❌ Error: SUPABASE_ACCESS_TOKEN environment variable is required')
    console.log('\nTo get your access token:')
    console.log('1. Go to https://supabase.com/dashboard/account/tokens')
    console.log('2. Generate a new access token')
    console.log('3. Run: SUPABASE_ACCESS_TOKEN=<token> npx tsx scripts/disable-email-confirmation.ts')
    process.exit(1)
  }

  console.log(`🔧 Disabling email confirmation for project: ${PROJECT_REF}`)
  
  try {
    const getResponse = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!getResponse.ok) {
      const error = await getResponse.text()
      throw new Error(`Failed to get auth config: ${getResponse.status} - ${error}`)
    }

    const currentConfig = await getResponse.json()
    console.log('\n📋 Current MAILER_AUTOCONFIRM:', currentConfig.MAILER_AUTOCONFIRM ?? 'not set (default: false)')

    const updateResponse = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MAILER_AUTOCONFIRM: true,
        }),
      }
    )

    if (!updateResponse.ok) {
      const error = await updateResponse.text()
      throw new Error(`Failed to update auth config: ${updateResponse.status} - ${error}`)
    }

    const updatedConfig = await updateResponse.json()
    console.log('✅ Updated MAILER_AUTOCONFIRM:', updatedConfig.MAILER_AUTOCONFIRM)
    console.log('\n🎉 Email confirmation is now DISABLED!')
    console.log('   Users can sign in immediately without verifying their email.')
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

disableEmailConfirmation()

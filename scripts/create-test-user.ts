import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function createTestUser() {
  const email = 'test@portpal.dev'
  const password = 'testpassword123'

  console.log('Creating test user:', email)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: 'Test',
      last_name: 'User',
      ilwu_local: '500',
      board: 'A BOARD',
    },
  })

  if (error) {
    console.error('Error creating user:', error.message)
    
    if (error.message.includes('already been registered')) {
      console.log('User already exists. Sign in with:')
      console.log(`  Email: ${email}`)
      console.log(`  Password: ${password}`)
      return
    }
    process.exit(1)
  }

  console.log('User created successfully!')
  console.log('Sign in with:')
  console.log(`  Email: ${email}`)
  console.log(`  Password: ${password}`)
  console.log('\nUser ID:', data.user?.id)
}

createTestUser().catch(console.error)

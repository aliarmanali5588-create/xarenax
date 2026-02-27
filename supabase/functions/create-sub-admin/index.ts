import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verify caller is super admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: claims, error: claimsError } = await supabaseAdmin.auth.getUser(token)
    if (claimsError || !claims.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    // Only super admin emails allowed
    const superAdminEmails = ['ashadislam333@gmail.com', 'selfashad@gmail.com']
    if (!superAdminEmails.includes(claims.user.email || '')) {
      return new Response(JSON.stringify({ error: 'Forbidden: Super admin only' }), { status: 403, headers: corsHeaders })
    }

    const { email, password, display_name, permissions } = await req.json()

    if (!email || !password || !display_name || !permissions) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: corsHeaders })
    }

    // 1. Create auth user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), { status: 400, headers: corsHeaders })
    }

    const userId = newUser.user.id

    // 2. Create profile
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        username: display_name,
        referral_code: referralCode,
        ign: display_name,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Cleanup: delete auth user
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return new Response(JSON.stringify({ error: 'Failed to create profile' }), { status: 500, headers: corsHeaders })
    }

    // 3. Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' })

    if (roleError) {
      console.error('Role assignment error:', roleError)
    }

    // 4. Create sub_admin record
    const { error: subAdminError } = await supabaseAdmin
      .from('sub_admins')
      .insert({
        user_id: userId,
        email,
        display_name,
        permissions,
        created_by: claims.user.id,
      })

    if (subAdminError) {
      console.error('Sub admin record error:', subAdminError)
    }

    return new Response(
      JSON.stringify({ success: true, user_id: userId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

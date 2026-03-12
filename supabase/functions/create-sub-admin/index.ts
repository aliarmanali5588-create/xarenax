import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify caller is super admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: claims, error: claimsError } = await supabaseAdmin.auth.getUser(token)
    if (claimsError || !claims.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Only super admin emails allowed
    const superAdminEmails = ['ashadislam333@gmail.com', 'selfashad@gmail.com']
    if (!superAdminEmails.includes(claims.user.email?.toLowerCase() || '')) {
      return new Response(JSON.stringify({ error: 'Forbidden: Super admin only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const payload = await req.json()
    const email = String(payload?.email || '').trim().toLowerCase()
    const password = String(payload?.password || '')
    const display_name = String(payload?.display_name || '').trim()
    const permissions = Array.isArray(payload?.permissions) ? payload.permissions : []

    if (!email || !password || !display_name || permissions.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let userId: string | null = null
    let createdNewUser = false

    // 1. Create auth user (or reuse if already exists)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) {
      const isDuplicateEmail =
        createError.status === 422 &&
        createError.message?.toLowerCase().includes('already been registered')

      if (!isDuplicateEmail) {
        console.error('Auth user creation error:', createError)
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { data: listedUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      })

      if (listError) {
        console.error('List users error:', listError)
        return new Response(JSON.stringify({ error: 'Could not resolve existing user for this email' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const existingUser = listedUsers.users.find(
        (u) => (u.email || '').toLowerCase() === email
      )

      if (!existingUser) {
        return new Response(JSON.stringify({ error: 'Email already exists but user could not be linked' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      userId = existingUser.id
    } else {
      userId = newUser.user.id
      createdNewUser = true
    }

    // 2. Ensure profile exists
    const { data: existingProfile, error: profileLookupError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (profileLookupError) {
      console.error('Profile lookup error:', profileLookupError)
      return new Response(JSON.stringify({ error: 'Failed to check profile status' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!existingProfile) {
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
        if (createdNewUser) {
          await supabaseAdmin.auth.admin.deleteUser(userId)
        }
        return new Response(JSON.stringify({ error: 'Failed to create profile: ' + profileError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // 3. Assign admin role (idempotent)
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role', ignoreDuplicates: true })

    if (roleError) {
      console.error('Role assignment error:', roleError)
      return new Response(JSON.stringify({ error: 'Failed to assign admin role' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 4. Create/update sub_admin record
    const { data: existingSubAdmin } = await supabaseAdmin
      .from('sub_admins')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    let subAdminError = null

    if (existingSubAdmin?.id) {
      const { error } = await supabaseAdmin
        .from('sub_admins')
        .update({
          email,
          display_name,
          permissions,
          is_active: true,
        })
        .eq('id', existingSubAdmin.id)
      subAdminError = error
    } else {
      const { error } = await supabaseAdmin
        .from('sub_admins')
        .insert({
          user_id: userId,
          email,
          display_name,
          permissions,
          created_by: claims.user.id,
        })
      subAdminError = error
    }

    if (subAdminError) {
      console.error('Sub admin record error:', subAdminError)
      return new Response(JSON.stringify({ error: 'Failed to save sub-admin details' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(
      JSON.stringify({ success: true, user_id: userId, created_new_auth_user: createdNewUser }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

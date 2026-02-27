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

    const superAdminEmails = ['ashadislam333@gmail.com', 'selfashad@gmail.com']
    if (!superAdminEmails.includes(claims.user.email || '')) {
      return new Response(JSON.stringify({ error: 'Forbidden: Super admin only' }), { status: 403, headers: corsHeaders })
    }

    const { sub_admin_id } = await req.json()

    if (!sub_admin_id) {
      return new Response(JSON.stringify({ error: 'Missing sub_admin_id' }), { status: 400, headers: corsHeaders })
    }

    // Get user_id from sub_admins
    const { data: subAdmin, error: fetchError } = await supabaseAdmin
      .from('sub_admins')
      .select('user_id')
      .eq('id', sub_admin_id)
      .single()

    if (fetchError || !subAdmin) {
      return new Response(JSON.stringify({ error: 'Sub admin not found' }), { status: 404, headers: corsHeaders })
    }

    const userId = subAdmin.user_id

    // Delete sub_admin record
    await supabaseAdmin.from('sub_admins').delete().eq('id', sub_admin_id)

    // Delete user_roles
    await supabaseAdmin.from('user_roles').delete().eq('user_id', userId)

    // Delete profile
    await supabaseAdmin.from('profiles').delete().eq('id', userId)

    // Delete auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError)
    }

    return new Response(
      JSON.stringify({ success: true }),
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

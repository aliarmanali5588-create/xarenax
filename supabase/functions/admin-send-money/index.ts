import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if user has admin role or is super admin
    const superAdminEmails = ['ashadislam333@gmail.com', 'selfashad@gmail.com']
    const isSuperAdmin = superAdminEmails.includes(user.email?.toLowerCase() || '')

    if (!isSuperAdmin) {
      const { data: roles } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle()

      if (!roles) {
        return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    const { userId, amount, type, description } = await req.json()

    if (!userId || !amount || !type || !description) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Fetch current profile using service role (bypasses RLS)
    const { data: currentProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('wallet_balance, total_winnings, total_deposited')
      .eq('id', userId)
      .single()

    if (fetchError || !currentProfile) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Calculate new balance
    const balanceChange = type === 'penalty' ? -amount : amount
    const updateData: any = {
      wallet_balance: Math.max(0, (currentProfile.wallet_balance || 0) + balanceChange),
    }

    if (type === 'winning') {
      updateData.total_winnings = (currentProfile.total_winnings || 0) + amount
    }

    if (type === 'deposit') {
      updateData.total_deposited = (currentProfile.total_deposited || 0) + amount
    }

    // Update profile using service role
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return new Response(JSON.stringify({ error: 'Failed to update wallet: ' + updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create transaction record
    const { error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: userId,
        amount,
        type,
        status: 'success',
        description,
      })

    if (transactionError) {
      console.error('Transaction insert error:', transactionError)
    }

    // Send notification
    const notificationMessage = type === 'deposit'
      ? `Your deposit of ₹${amount} has been approved and credited to your wallet. ${description}`
      : type === 'winning'
      ? `Congratulations! You received ₹${amount} as tournament winnings. ${description}`
      : type === 'refund'
      ? `Your refund of ₹${amount} has been processed. ${description}`
      : type === 'bonus'
      ? `You received a bonus of ₹${amount}! ${description}`
      : `₹${amount} has been deducted from your wallet. Reason: ${description}`

    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        title: type === 'winning' ? '🏆 Tournament Winning!'
          : type === 'refund' ? '💰 Refund Processed'
          : type === 'bonus' ? '🎁 Bonus Received'
          : '⚠️ Wallet Deduction',
        message: notificationMessage,
        type: type === 'penalty' ? 'system' : 'payment',
      })

    return new Response(JSON.stringify({
      success: true,
      newBalance: updateData.wallet_balance
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

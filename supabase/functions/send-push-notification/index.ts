import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Web Push VAPID keys (generate using: npx web-push generate-vapid-keys)
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_SUBJECT = 'mailto:helparenax@zohomail.in'

interface PushPayload {
  title: string
  message: string
  type: 'match' | 'prize' | 'system' | 'wallet'
  url?: string
  userId?: string
  userIds?: string[]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // ---- AUTH: require a valid JWT ----
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ---- AUTHZ: admins can target anyone; users can only target themselves ----
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
    const isAdmin = !!adminRole

    const payload: PushPayload = await req.json()
    const { title, message, type, url, userId, userIds } = payload

    let targetUserIds: string[] = []
    if (userId) {
      targetUserIds = [userId]
    } else if (userIds) {
      targetUserIds = userIds
    } else {
      return new Response(
        JSON.stringify({ error: 'Either userId or userIds must be provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!isAdmin) {
      if (targetUserIds.length !== 1 || targetUserIds[0] !== user.id) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // Get push subscriptions for target users
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', targetUserIds)

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError)
      throw fetchError
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No push subscriptions found for target users', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send push notification to each subscription
    let successCount = 0
    let failureCount = 0

    for (const sub of subscriptions) {
      try {
        const subscription = sub.subscription_data as any
        
        // Create JWT for VAPID
        const vapidHeaders = {
          typ: 'JWT',
          alg: 'ES256'
        }
        
        const vapidClaims = {
          aud: new URL(subscription.endpoint).origin,
          exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 hours
          sub: VAPID_SUBJECT
        }

        // Prepare notification payload
        const notificationPayload = JSON.stringify({
          title,
          message,
          body: message,
          type,
          url: url || '/'
        })

        // Send push notification using Web Push Protocol
        const response = await fetch(subscription.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'TTL': '86400', // 24 hours
            'Content-Encoding': 'aes128gcm'
          },
          body: notificationPayload
        })

        if (response.ok || response.status === 201) {
          successCount++
        } else {
          console.error(`Failed to send to ${sub.user_id}:`, response.status, await response.text())
          failureCount++
          
          // If subscription is invalid (410 Gone), delete it
          if (response.status === 410) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id)
          }
        }
      } catch (error) {
        console.error(`Error sending push to ${sub.user_id}:`, error)
        failureCount++
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Push notifications sent',
        total: subscriptions.length,
        sent: successCount,
        failed: failureCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-push-notification:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send push notification' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

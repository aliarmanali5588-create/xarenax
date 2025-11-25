import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting tournament reminder check...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate time window: 15-20 minutes from now
    const now = new Date();
    const reminderStart = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    const reminderEnd = new Date(now.getTime() + 20 * 60 * 1000); // 20 minutes
    
    console.log('Checking tournaments between:', reminderStart.toISOString(), 'and', reminderEnd.toISOString());

    // Find tournaments starting in 15-20 minutes
    const { data: tournaments, error: tournamentsError } = await supabase
      .from('tournaments')
      .select('id, title, start_time')
      .gte('start_time', reminderStart.toISOString())
      .lte('start_time', reminderEnd.toISOString())
      .in('status', ['open', 'full']);

    if (tournamentsError) {
      console.error('Error fetching tournaments:', tournamentsError);
      throw tournamentsError;
    }

    console.log(`Found ${tournaments?.length || 0} tournaments starting soon`);

    if (!tournaments || tournaments.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No tournaments starting soon', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let totalNotificationsSent = 0;

    // Process each tournament
    for (const tournament of tournaments) {
      console.log(`Processing tournament: ${tournament.title} (${tournament.id})`);

      // Get all paid participants
      const { data: participants, error: participantsError } = await supabase
        .from('participants')
        .select('user_id')
        .eq('tournament_id', tournament.id)
        .eq('payment_status', 'paid');

      if (participantsError) {
        console.error(`Error fetching participants for tournament ${tournament.id}:`, participantsError);
        continue;
      }

      console.log(`Found ${participants?.length || 0} paid participants`);

      if (!participants || participants.length === 0) continue;

      // Calculate minutes until start
      const startTime = new Date(tournament.start_time);
      const minutesUntil = Math.round((startTime.getTime() - now.getTime()) / (1000 * 60));

      // For each participant, check if notification already exists
      for (const participant of participants) {
        // Check if notification already sent
        const { data: existingNotification } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', participant.user_id)
          .eq('type', 'match')
          .ilike('message', `%${tournament.id}%`)
          .gte('created_at', new Date(now.getTime() - 30 * 60 * 1000).toISOString()) // Within last 30 minutes
          .maybeSingle();

        if (existingNotification) {
          console.log(`Notification already sent to user ${participant.user_id} for tournament ${tournament.id}`);
          continue;
        }

        // Create notification
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: participant.user_id,
            title: '⚔️ Match Starting Soon!',
            message: `Your tournament "${tournament.title}" starts in ${minutesUntil} minutes! Get ready to dominate! 🎮\n\nGo to Tournaments page to view Room ID & Password.`,
            type: 'match'
          });

        if (notificationError) {
          console.error(`Error creating notification for user ${participant.user_id}:`, notificationError);
        } else {
          console.log(`Notification sent to user ${participant.user_id}`);
          totalNotificationsSent++;
          
          // Also send push notification
          try {
            await supabase.functions.invoke('send-push-notification', {
              body: {
                userId: participant.user_id,
                title: '⚔️ Match Starting Soon!',
                message: `Your tournament "${tournament.title}" starts in ${minutesUntil} minutes!`,
                type: 'match',
                url: '/tournaments'
              }
            });
          } catch (pushError) {
            console.error(`Error sending push notification to user ${participant.user_id}:`, pushError);
          }
        }
      }
    }

    console.log(`Tournament reminder check completed. Sent ${totalNotificationsSent} notifications.`);

    return new Response(
      JSON.stringify({ 
        message: 'Tournament reminders processed',
        tournaments: tournaments.length,
        notifications_sent: totalNotificationsSent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in tournament-reminders function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const RESEND_API_KEY = 're_kpBefNv1_LXvyqimYo6S2LtPhDEbk74UV';
const FROM_EMAIL = 'waitly@jameskaranja.me';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface WelcomeEmailRequest {
  entryId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { entryId }: WelcomeEmailRequest = await req.json();

    if (!entryId) {
      throw new Error('Entry ID is required');
    }

    const { data: entry, error: entryError } = await supabase
      .from('waitlist_entries')
      .select('*, projects!inner(id, name)')
      .eq('id', entryId)
      .single();

    if (entryError || !entry) {
      throw new Error('Waitlist entry not found');
    }

    const { data: campaigns, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('project_id', entry.project_id)
      .eq('trigger_type', 'automatic')
      .eq('trigger_event', 'on_join')
      .eq('is_active', true)
      .eq('status', 'draft');

    if (campaignError || !campaigns || campaigns.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No active welcome campaigns found' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const results = [];

    for (const campaign of campaigns) {
      try {
        const personalizedSubject = campaign.subject
          .replace(/\{\{name\}\}/g, entry.name)
          .replace(/\{\{position\}\}/g, entry.position.toString())
          .replace(/\{\{waitlist_name\}\}/g, entry.projects.name);

        const personalizedBody = campaign.body
          .replace(/\{\{name\}\}/g, entry.name)
          .replace(/\{\{position\}\}/g, entry.position.toString())
          .replace(/\{\{waitlist_name\}\}/g, entry.projects.name);

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [entry.email],
            subject: personalizedSubject,
            text: personalizedBody,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.text();
          results.push({ campaign: campaign.name, success: false, error: errorData });
          continue;
        }

        await supabase.from('email_events').insert({
          campaign_id: campaign.id,
          entry_id: entryId,
          event_type: 'sent',
          email: entry.email,
          metadata: { position: entry.position, trigger: 'on_join' },
        });

        await supabase
          .from('email_campaigns')
          .update({
            total_sent: campaign.total_sent + 1,
          })
          .eq('id', campaign.id);

        results.push({ campaign: campaign.name, success: true });
      } catch (error) {
        results.push({ campaign: campaign.name, success: false, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
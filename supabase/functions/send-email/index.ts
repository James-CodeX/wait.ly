import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const RESEND_API_KEY = 're_kpBefNv1_LXvyqimYo6S2LtPhDEbk74UV';
const FROM_EMAIL = 'waitly@jameskaranja.me';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface SendEmailRequest {
  campaignId: string;
  testEmail?: string;
}

interface EmailRecipient {
  email: string;
  name: string;
  position: number;
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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { campaignId, testEmail }: SendEmailRequest = await req.json();

    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }

    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*, projects!inner(name, owner_id)')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.projects.owner_id !== user.id) {
      throw new Error('Unauthorized to send this campaign');
    }

    let recipients: EmailRecipient[] = [];

    if (testEmail) {
      recipients = [{
        email: testEmail,
        name: 'Test User',
        position: 1,
      }];
    } else {
      const { data: entries, error: entriesError } = await supabase
        .from('waitlist_entries')
        .select('email, name, position')
        .eq('project_id', campaign.project_id)
        .eq('status', 'active')
        .order('position', { ascending: true });

      if (entriesError) {
        throw new Error('Failed to fetch recipients');
      }

      recipients = entries || [];
    }

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No recipients to send to', sent: 0 }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        const personalizedSubject = campaign.subject
          .replace(/\{\{name\}\}/g, recipient.name)
          .replace(/\{\{position\}\}/g, recipient.position.toString())
          .replace(/\{\{waitlist_name\}\}/g, campaign.projects.name);

        const personalizedBody = campaign.body
          .replace(/\{\{name\}\}/g, recipient.name)
          .replace(/\{\{position\}\}/g, recipient.position.toString())
          .replace(/\{\{waitlist_name\}\}/g, campaign.projects.name);

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [recipient.email],
            subject: personalizedSubject,
            text: personalizedBody,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.text();
          errors.push(`Failed to send to ${recipient.email}: ${errorData}`);
          continue;
        }

        sentCount++;

        if (!testEmail) {
          await supabase.from('email_events').insert({
            campaign_id: campaignId,
            entry_id: null,
            event_type: 'sent',
            email: recipient.email,
            metadata: { position: recipient.position },
          });
        }
      } catch (error) {
        errors.push(`Error sending to ${recipient.email}: ${error.message}`);
      }
    }

    if (!testEmail) {
      await supabase
        .from('email_campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          total_sent: campaign.total_sent + sentCount,
        })
        .eq('id', campaignId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        total: recipients.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending emails:', error);
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
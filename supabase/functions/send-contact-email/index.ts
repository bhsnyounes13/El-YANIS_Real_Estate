import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyTitle?: string;
  propertyId?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, phone, message, propertyTitle, propertyId }: ContactRequest = await req.json();

    const emailSubject = propertyTitle 
      ? `New Property Inquiry: ${propertyTitle}`
      : "New Contact Form Submission";

    const emailBody = `
New Contact Form Submission

============================
Contact Details:
============================
Name: ${name}
Email: ${email}
Phone: ${phone}

============================
Message:
============================
${message}

${propertyTitle ? `\n============================\nProperty Details:\n============================\nProperty: ${propertyTitle}\nProperty ID: ${propertyId}\n` : ''}

============================
Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Algiers' })}
    `;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({ success: true, message: 'Contact saved but email not configured' }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Real Estate <onboarding@resend.dev>',
        to: ['elyanismo@gmail.com'],
        subject: emailSubject,
        text: emailBody,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({ success: true, message: 'Contact saved but email failed to send' }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully', data }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
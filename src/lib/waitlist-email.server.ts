import logoAssetPath from "@/assets/scholaport-logo.png";
import poriMascotPath from "@/assets/pori-mascot.png";

export type WaitlistRouteDetails = {
  email: string;
  sourceLabel: string;
  destinationLabel: string;
};

type EmailAddress = {
  email: string;
  name?: string;
};

type EmailSendResult = {
  messageId: string;
};

type EmailBinding = {
  send(message: {
    to: string;
    from: string | EmailAddress;
    replyTo?: string | EmailAddress;
    subject: string;
    html: string;
    text: string;
  }): Promise<EmailSendResult>;
};

type WaitlistEmailEnvironment = {
  EMAIL?: EmailBinding;
  WAITLIST_EMAIL_FROM?: string;
  WAITLIST_EMAIL_REPLY_TO?: string;
};

const BRAND = {
  navy: "#0A175A",
  teal: "#087F78",
  mint: "#9FF2E6",
  paleMint: "#EAFFF9",
  ivory: "#FFFDF8",
  ink: "#17213D",
  muted: "#657085",
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function emailDocument(details: WaitlistRouteDetails, origin: string) {
  const source = escapeHtml(details.sourceLabel);
  const destination = escapeHtml(details.destinationLabel);
  const logoUrl = new URL(logoAssetPath, origin).toString();
  const poriUrl = new URL(poriMascotPath, origin).toString();
  const betaUrl = new URL("/#beta-access", origin).toString();

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>Your ScholaPort route request is saved</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  </head>
  <body style="margin:0;background:${BRAND.ivory};color:${BRAND.ink};font-family:'Plus Jakarta Sans','Manrope',Inter,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      We saved your request for ${source} to ${destination}.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.ivory};border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:620px;border-collapse:collapse;">
            <tr>
              <td style="padding:0 4px 22px;">
                <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${logoUrl}" width="42" height="42" alt="ScholaPort" style="display:block;width:42px;height:42px;border-radius:10px;object-fit:cover;">
                    </td>
                    <td style="padding-left:11px;vertical-align:middle;font-size:24px;font-weight:normal;letter-spacing:-0.4px;color:${BRAND.navy};font-family:'Gumriot','Plus Jakarta Sans',sans-serif;">
                      ScholaPort
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="overflow:hidden;border-radius:28px;background:${BRAND.navy};">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:44px 42px 38px;position:relative;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                        <tr>
                          <td style="vertical-align:top;">
                            <div style="margin-bottom:20px;font-size:11px;font-weight:800;letter-spacing:1.7px;text-transform:uppercase;color:${BRAND.mint};">
                              Expansion route · request received
                            </div>
                            <h1 style="margin:0;max-width:400px;font-size:38px;line-height:1.06;letter-spacing:-1.2px;color:#FFFFFF;font-weight:normal;font-family:'Gumriot','Plus Jakarta Sans',sans-serif;">
                              Your route is now in view.
                            </h1>
                            <p style="margin:20px 0 0;max-width:440px;font-size:15px;line-height:1.68;color:#DCE3FF;">
                              We saved your request and will use it to help decide which verified academic routes ScholaPort researches next.
                            </p>
                          </td>
                          <td width="90" align="right" style="vertical-align:top;padding-top:10px;">
                            <img src="${poriUrl}" width="84" alt="Pori" style="display:block;width:84px;height:auto;object-contain;">
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 18px 18px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-radius:20px;background:${BRAND.paleMint};">
                        <tr>
                          <td style="padding:24px 24px 22px;">
                            <div style="font-size:10px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase;color:${BRAND.teal};">
                              Route requested
                            </div>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:11px;border-collapse:collapse;">
                              <tr>
                                <td style="font-size:16px;line-height:1.45;font-weight:750;color:${BRAND.navy};">${source}</td>
                                <td width="42" align="center" style="font-size:20px;color:${BRAND.teal};">→</td>
                                <td align="right" style="font-size:16px;line-height:1.45;font-weight:750;color:${BRAND.navy};">${destination}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 12px 0;">
                <h2 style="margin:0;font-size:20px;line-height:1.3;letter-spacing:-0.45px;color:${BRAND.navy};font-weight:normal;font-family:'Gumriot','Plus Jakarta Sans',sans-serif;">
                  What happens next
                </h2>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.75;color:${BRAND.muted};">
                  Your request joins our private route-demand list. If this route becomes part of a complete, reviewed ScholaPort workflow, we’ll email you with the next step.
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border-collapse:collapse;background:#F2F6F5;border-radius:18px;">
                  <tr>
                    <td style="padding:22px 24px;">
                      <div style="font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:${BRAND.teal};">
                        Clear expectations
                      </div>
                      <p style="margin:9px 0 0;font-size:13px;line-height:1.7;color:#526079;">
                        This does not submit a school application or make a credit decision. You do not need to upload documents for this request.
                      </p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:26px;border-collapse:collapse;">
                  <tr>
                    <td style="border-radius:999px;background:${BRAND.navy};">
                      <a href="${betaUrl}" style="display:inline-block;padding:14px 21px;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:800;">
                        Return to ScholaPort&nbsp;&nbsp;→
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 12px 8px;font-size:11px;line-height:1.65;color:#8991A2;">
                This one-time confirmation was sent because you requested a ScholaPort expansion route. ScholaPort provides planning previews; receiving schools make all final academic decisions.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `SCHOLAPORT

Your route is now in view.

We saved your request for ${details.sourceLabel} to ${details.destinationLabel}. Your request joins our private route-demand list and helps us decide which verified academic routes to research next.

If this route becomes part of a complete, reviewed ScholaPort workflow, we’ll email you with the next step.

Clear expectations: this does not submit a school application or make a credit decision. You do not need to upload documents for this request.

Return to ScholaPort: ${betaUrl}

This one-time confirmation was sent because you requested a ScholaPort expansion route. Receiving schools make all final academic decisions.`;

  return { html, text };
}

async function getEmailEnvironment(): Promise<WaitlistEmailEnvironment> {
  return {
    WAITLIST_EMAIL_FROM: process.env.WAITLIST_EMAIL_FROM,
    WAITLIST_EMAIL_REPLY_TO: process.env.WAITLIST_EMAIL_REPLY_TO,
  };
}

export async function sendWaitlistConfirmation(details: WaitlistRouteDetails, origin: string) {
  const runtime = await getEmailEnvironment();
  const from = runtime.WAITLIST_EMAIL_FROM?.trim();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  if (!resendApiKey || !from) {
    throw new Error("Waitlist email delivery (Resend) is not configured.");
  }

  const content = emailDocument(details, origin);
  
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to: details.email,
      from: from,
      reply_to: runtime.WAITLIST_EMAIL_REPLY_TO?.trim() || undefined,
      subject: "Your ScholaPort route request is saved",
      html: content.html,
      text: content.text
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} ${errorText}`);
  }

  return await response.json();
}

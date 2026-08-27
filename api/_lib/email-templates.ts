import { supabaseAdmin } from './supabase.js';

// Simple inline CSS for email compatibility matching the premium editorial identity
const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111111; max-width: 600px; margin: 0 auto; padding: 20px; }
  h1 { font-family: Georgia, serif; font-weight: normal; color: #111111; border-bottom: 1px solid #EAEAEA; padding-bottom: 10px; }
  .accent { color: #B5964A; font-weight: bold; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
  .box { background-color: #FAFAF8; border: 1px solid #EAEAEA; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #EAEAEA; padding-bottom: 10px; }
  .row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .footer { font-size: 12px; color: #5F5F5F; margin-top: 40px; text-align: center; border-top: 1px solid #EAEAEA; padding-top: 20px; }
  .mono { font-family: monospace; color: #B43B23; }
`;

async function getTemplateFromDB(templateType: string) {
  const { data } = await supabaseAdmin
    .from('email_templates')
    .select('subject, body_content')
    .eq('template_type', templateType)
    .single();
  return data;
}

function processBodyText(text: string, variables: Record<string, string | number>) {
  let processed = text;
  for (const [key, value] of Object.entries(variables)) {
    processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  // Convert newlines to paragraphs
  return processed
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

function processSubject(text: string, variables: Record<string, string | number>) {
  let processed = text;
  for (const [key, value] of Object.entries(variables)) {
    processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return processed;
}

export async function getPreorderConfirmationEmail(name: string, bookTitle: string, quantity: number, amountPaidNaira: number, reference: string, releaseDate: string) {
  const amountStr = amountPaidNaira.toLocaleString('en-NG', { minimumFractionDigits: 2 });
  
  const template = await getTemplateFromDB('preorder_confirmation');
  
  const variables = { name, bookTitle, quantity, amount: amountStr, reference, releaseDate };
  
  const subject = template ? processSubject(template.subject, variables) : `Your Preorder is Confirmed - ${bookTitle}`;
  const bodyText = template ? processBodyText(template.body_content, variables) : `<p>Dear ${name},</p><p>Thank you for securing your preorder. Your payment has been successfully processed, and your copy is reserved.</p><p>Your guided reflection bonuses have been secured. The expected release date is <strong>${releaseDate}</strong>. We will notify you via email as soon as your copy is ready.</p>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="accent">ORDER CONFIRMED</div>
      <h1>${bookTitle}</h1>
      
      ${bodyText}
      
      <div class="box">
        <div class="row"><span>Item:</span> <strong>${quantity}x ${bookTitle}</strong></div>
        <div class="row"><span>Amount Paid:</span> <strong class="mono">₦${amountStr}</strong></div>
        <div class="row"><span>Reference:</span> <span style="font-size:12px; color:#5F5F5F;">${reference}</span></div>
      </div>
      
      <div class="footer">
        © ${new Date().getFullYear()} Mimshach Obioha. All rights reserved.
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export async function getCopyReadyEmail(name: string, bookTitle: string, reference: string) {
  const template = await getTemplateFromDB('copy_ready');
  const variables = { name, bookTitle, reference };
  
  const subject = template ? processSubject(template.subject, variables) : `YOUR COPY IS READY: ${bookTitle}`;
  const bodyText = template ? processBodyText(template.body_content, variables) : `<p>Dear ${name},</p><p>Great news! Your preordered copy of <strong>${bookTitle}</strong> is now ready and available.</p><p>We will be in touch shortly with further instructions on how to access your copy.</p>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="accent">YOUR COPY IS READY</div>
      <h1>${bookTitle}</h1>
      ${bodyText}
      <p>Order Reference: <span style="font-size:12px; color:#5F5F5F;">${reference}</span></p>
      <div class="footer">
        © ${new Date().getFullYear()} Mimshach Obioha. All rights reserved.
      </div>
    </body>
    </html>
  `;
  return { subject, html };
}

export async function getReleaseNotificationEmail(name: string, bookTitle: string) {
  const template = await getTemplateFromDB('release_notification');
  const variables = { name, bookTitle };
  
  const subject = template ? processSubject(template.subject, variables) : `OFFICIAL RELEASE: ${bookTitle}`;
  const bodyText = template ? processBodyText(template.body_content, variables) : `<p>Dear ${name},</p><p>The wait is over. <strong>${bookTitle}</strong> is officially released today!</p><p>Because you secured a preorder, your copy is guaranteed. We will contact you directly with instructions on how to access your copy.</p><p>Thank you for your early support.</p>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="accent">OFFICIAL RELEASE</div>
      <h1>${bookTitle}</h1>
      ${bodyText}
      <div class="footer">
        © ${new Date().getFullYear()} Mimshach Obioha. All rights reserved.
      </div>
    </body>
    </html>
  `;
  return { subject, html };
}

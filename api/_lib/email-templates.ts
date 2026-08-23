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

export function getPreorderConfirmationHtml(name: string, bookTitle: string, quantity: number, amountPaidKobo: number, reference: string, releaseDate: string) {
  const amountStr = (amountPaidKobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 });
  
  return `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="accent">ORDER CONFIRMED</div>
      <h1>Ramblings & Epiphanies</h1>
      <p>Dear ${name},</p>
      <p>Thank you for securing your preorder. Your payment has been successfully processed, and your copy is reserved.</p>
      
      <div class="box">
        <div class="row"><span>Item:</span> <strong>${quantity}x ${bookTitle}</strong></div>
        <div class="row"><span>Amount Paid:</span> <strong class="mono">₦${amountStr}</strong></div>
        <div class="row"><span>Reference:</span> <span style="font-size:12px; color:#5F5F5F;">${reference}</span></div>
      </div>

      <p>Your dispatch receipt and guided reflection bonuses have been secured. The expected release date is <strong>${releaseDate}</strong>. We will notify you via email as soon as your copy is ready for delivery.</p>
      
      <div class="footer">
        © ${new Date().getFullYear()} Mimshach Obioha. All rights reserved.
      </div>
    </body>
    </html>
  `;
}

export function getCopyReadyHtml(name: string, bookTitle: string, reference: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="accent">YOUR COPY IS READY</div>
      <h1>Ramblings & Epiphanies</h1>
      <p>Dear ${name},</p>
      <p>Great news! Your preordered copy of <strong>${bookTitle}</strong> is now ready and is being prepared for dispatch.</p>
      <p>Order Reference: <span style="font-size:12px; color:#5F5F5F;">${reference}</span></p>
      <p>We will be in touch shortly with final delivery details.</p>
      <div class="footer">
        © ${new Date().getFullYear()} Mimshach Obioha. All rights reserved.
      </div>
    </body>
    </html>
  `;
}

export function getReleaseNotificationHtml(name: string, bookTitle: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyles}</style></head>
    <body>
      <div class="accent">OFFICIAL RELEASE</div>
      <h1>Ramblings & Epiphanies</h1>
      <p>Dear ${name},</p>
      <p>The wait is over. <strong>${bookTitle}</strong> is officially released today!</p>
      <p>Because you secured a preorder, your copy is guaranteed. Our fulfillment team is actively processing all preorders and will contact you directly with tracking or delivery confirmation.</p>
      <p>Thank you for your early support.</p>
      <div class="footer">
        © ${new Date().getFullYear()} Mimshach Obioha. All rights reserved.
      </div>
    </body>
    </html>
  `;
}

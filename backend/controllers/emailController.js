const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP FULL ERROR:', error);
    console.error('SMTP ERROR CODE:', error.code);
    console.error('SMTP ERROR MESSAGE:', error.message);
  } else {
    console.log('SMTP Server Ready to Send Emails');
  }
});

const ICONS = {
  '👤': `<span style="font-size:16px;line-height:1;">&#128100;</span>`,
  '📧': `<span style="font-size:16px;line-height:1;">&#9993;</span>`,
  '📱': `<span style="font-size:16px;line-height:1;">&#9742;</span>`,
  '🏙️': `<span style="font-size:16px;line-height:1;">&#127961;</span>`,
  '🏢': `<span style="font-size:16px;line-height:1;">&#127970;</span>`,
  '📦': `<span style="font-size:16px;line-height:1;">&#128230;</span>`,
  '📍': `<span style="font-size:16px;line-height:1;">&#128205;</span>`,
  '📅': `<span style="font-size:16px;line-height:1;">&#128197;</span>`,
  '✨': `<span style="font-size:16px;line-height:1;">&#10024;</span>`,
  '💬': `<span style="font-size:16px;line-height:1;">&#128172;</span>`,
  '🎯': `<span style="font-size:16px;line-height:1;">&#127919;</span>`,
};

const iconOf = (token) => ICONS[token] || token;
const EMAIL_TIMEOUT_MS = 10000;

const sendMailWithTimeout = (mailOptions, timeoutMs = EMAIL_TIMEOUT_MS) =>
  Promise.race([
    transporter.sendMail(mailOptions),
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Email service timeout'));
      }, timeoutMs);
    }),
  ]);

const emailWrapper = (content, accentColor = '#0EA5E9') => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" 
          content="width=device-width,initial-scale=1"/>
  </head>
  <body style="
    margin: 0;
    padding: 0;
    background-color: #F0F7FF;
    font-family: Arial, Helvetica, sans-serif;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 16px;
    ">

      <!-- Main Card -->
      <div style="
        background: #FFFFFF;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(14,165,233,0.12);
        border: 1px solid #E0F0FF;
      ">

        <!-- Header - Text Only -->
        <div style="
          background: linear-gradient(135deg,
        #0EA5E9 0%, #06B6D4 100%);
          padding: 40px 30px;
          text-align: center;
        ">
          <h1 style="
            color: #FFFFFF;
            font-size: 30px;
            font-weight: 900;
            letter-spacing: 5px;
            margin: 0 0 8px 0;
            text-shadow: 0 2px 10px rgba(0,0,0,0.15);
          ">LIFEE</h1>
          <p style="
            color: rgba(255,255,255,0.9);
            font-size: 11px;
            letter-spacing: 3px;
            margin: 0;
            text-transform: uppercase;
          ">PREMIUM WATER</p>
        </div>

        <!-- Body Content -->
        <div style="
          padding: 36px 32px;
          background: #FFFFFF;
        ">
          ${content}
        </div>

        <!-- Footer -->
        <div style="
          background: #F8FBFF;
          border-top: 1px solid #E0F0FF;
          padding: 24px 32px;
          text-align: center;
        ">
          <p style="
            color: #0EA5E9;
            font-size: 13px;
            font-weight: 700;
            margin: 0 0 6px 0;
            letter-spacing: 1px;
          ">LIFEE PREMIUM WATER</p>
          <p style="
            color: #94A3B8;
            font-size: 11px;
            margin: 0;
            line-height: 1.8;
          ">
            Madhya Pradesh, India<br/>
            Pure &amp; Natural | Every Drop Matters<br/>
            &copy; 2026 LIFEE Water. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  </body>
  </html>
`;

const infoCard = (items) => `
  <div style="
    background: #F8FBFF;
    border: 1px solid #DBEAFE;
    border-radius: 14px;
    padding: 8px 0;
    margin: 20px 0;
    overflow: hidden;
  ">
    ${items.map((item, index) => `
      <div style="
        display: table;
        width: 100%;
        padding: 14px 20px;
        border-bottom: ${index < items.length - 1 ? '1px solid #EFF6FF' : 'none'};
        box-sizing: border-box;
      ">
        <div style="
          display: table-cell;
          width: 36px;
          vertical-align: middle;
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: #EFF6FF;
            border-radius: 8px;
            text-align: center;
            line-height: 32px;
            font-size: 16px;
          ">${iconOf(item.icon)}</div>
        </div>
        <div style="
          display: table-cell;
          vertical-align: middle;
          padding-left: 12px;
        ">
          <p style="
            color: #94A3B8;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 3px 0;
            font-weight: 600;
          ">${item.label}</p>
          <p style="
            color: #1E293B;
            font-size: 14px;
            font-weight: 600;
            margin: 0;
          ">${item.value}</p>
        </div>
      </div>
    `).join('')}
  </div>
`;

// --- 1. CONTACT FORM EMAIL ---
exports.sendContactEmail = async (req, res) => {
  const { name, email, phone, location, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, email and message are required'
    });
  }

  try {
    await sendMailWithTimeout({
      from: `"LIFEE Premium Water" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Message from ${name} — LIFEE`,
      html: emailWrapper(`
        <!-- Alert Banner -->
        <div style="
          background: #EFF6FF;
          border-left: 4px solid #0EA5E9;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" 
               fill="none" stroke="#0EA5E9" stroke-width="2"
               style="min-width:20px;margin-right:12px;">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <div>
            <p style="color:#0EA5E9;font-weight:700;
                      font-size:13px;margin:0 0 2px;">
              New Contact Message
            </p>
            <p style="color:#64748B;font-size:12px;margin:0;">
              Someone reached out via your website
            </p>
          </div>
        </div>

        <!-- Section Title -->
        <p style="
          color: #0EA5E9;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 0 0 8px 0;
        ">Contact Details</p>

        ${infoCard([
          { icon: '👤', label: 'Full Name', value: name },
          { icon: '📧', label: 'Email Address', value: email },
          { icon: '📱', label: 'Phone Number', value: phone || 'Not provided' },
          { icon: '📍', label: 'Location', value: location || 'Not provided' },
        ])}

        <!-- Message -->
        <p style="
          color: #0EA5E9;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 24px 0 8px 0;
        ">Message</p>
        <div style="
          background: #F8FBFF;
          border: 1px solid #DBEAFE;
          border-radius: 14px;
          padding: 20px;
        ">
          <p style="
            color: #334155;
            font-size:15px;
            line-height:1.8;
            margin: 0;
          ">${message}</p>
        </div>

        <!-- Reply Button -->
        <div style="text-align:center;margin-top:28px;">
          <a href="mailto:${email}" style="
            display: inline-block;
            background: linear-gradient(135deg,#0EA5E9,#06B6D4);
            color: white;
            text-decoration: none;
            padding: 14px 36px;
            border-radius: 50px;
            font-weight: 700;
            font-size:14px;
            letter-spacing:0.5px;
          ">Reply to ${name}</a>
        </div>
      `),
      attachments: [],
    });

    // Send customer acknowledgement in background to keep API response fast.
    sendMailWithTimeout({
      from: `"LIFEE Premium Water" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `We received your message — LIFEE Water`,
      html: emailWrapper(`
        <!-- Success Icon -->
        <div style="text-align:center;margin-bottom:28px;">
          <div style="
      width: 72px;
      height: 72px;
      background: #ECFDF5;
      border-radius: 50%;
      margin: 0 auto 16px;
      border: 2px solid #A7F3D0;
      text-align: center;
      line-height: 72px;
      font-size: 36px;
    ">✅</div>
          <h2 style="
            color: #1E293B;
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 10px 0;
          ">Message Received!</h2>
          <p style="
            color: #64748B;
            font-size: 14px;
            line-height: 1.7;
            margin: 0 auto;
            max-width: 380px;
          ">
            Hi <strong style="color:#0EA5E9;">${name}</strong>,
            we have received your message and will
            get back to you within 24 hours.
          </p>
        </div>

        <p style="
      color: #94A3B8;font-size: 13px;
      text-align: center;margin: 20px 0 0;
    ">
      We will reply to 
      <strong style="color:#0EA5E9;">${email}</strong>
      within 24 hours.
        </p>
      `),
      attachments: [],
    }).catch((ackError) => {
      console.error('Contact ack email failed:', ackError.message);
    });

    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      error: error.message 
    });
  }
};

// --- 2. ORDER EMAIL ---
exports.sendOrderEmail = async (req, res) => {
  const { name, email, phone, address, product, quantity } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, phone'
    });
  }

  try {
    await sendMailWithTimeout({
      from: `"LIFEE Premium Water" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Order Request - ${name}`,
      html: `
        <h2>New Order Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Address:</b> ${address || 'Not provided'}</p>
        <p><b>Product:</b> ${product || 'Not specified'}</p>
        <p><b>Quantity:</b> ${quantity || 'Not specified'}</p>
      `,
      attachments: [],
    });

    // Send customer acknowledgement in background to keep API response fast.
    sendMailWithTimeout({
      from: `"LIFEE Premium Water" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Order Request - LIFEE Water',
      html: `
        <h2>Hi ${name},</h2>
        <p>We received your order request for
           LIFEE Premium Water.</p>
        <p>Our team will contact you shortly to
           confirm your order.</p>
        <br/>
        <p><b>LIFEE Premium Water Team</b></p>
      `,
      attachments: [],
    }).catch((ackError) => {
      console.error('Order ack email failed:', ackError.message);
    });

    res.json({ success: true, message: 'Order request sent!' });
  } catch (error) {
    console.error('FULL ERROR DETAILS:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Response:', error.response);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.response,
    });
  }
};

// --- 3. DISTRIBUTOR EMAIL ---
exports.sendDistributorEmail = async (req, res) => {
  const { name, email, phone, city, businessName } = req.body;
  const cleanPhone = String(phone || '').replace(/\s+/g, '').replace(/-/g, '');

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Name, email and phone are required'
    });
  }

  try {
    await sendMailWithTimeout({
      from: `"LIFEE Premium Water" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Distributor Application — ${name}`,
      html: emailWrapper(`
        <div style="
          background: #EFF6FF;
          border-left: 4px solid #0EA5E9;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 28px;
        ">
          <p style="color:#0EA5E9;font-weight:700;
                    font-size:13px;margin:0 0 2px;">
            New Distributor Application
          </p>
          <p style="color:#64748B;font-size:12px;margin:0;">
            Someone wants to distribute LIFEE Water
          </p>
        </div>

        <p style="
          color: #0EA5E9;font-size:11px;font-weight:700;
          text-transform:uppercase;letter-spacing:1.5px;
          margin:0 0 8px;
        ">Applicant Details</p>

        ${infoCard([
          { icon:'👤', label:'Full Name', value: name },
          { icon:'📧', label:'Email', value: email },
          { icon:'📱', label:'Phone', value: phone },
          { icon:'🏙️', label:'City', value: city || 'Not specified' },
          { icon:'🏢', label:'Business Name', value: businessName || 'Not specified' },
        ])}

        <div style="
          display: table;
          width: 100%;
          margin-top: 24px;
          border-collapse: separate;
          border-spacing: 8px;
        ">
          <div style="display:table-cell;">
            <a href="mailto:${email}" style="
              display: block;
              background: linear-gradient(135deg,#0EA5E9,#06B6D4);
              color: white;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 10px;
              font-weight: 700;
              font-size: 13px;
              text-align: center;
            ">Email Applicant</a>
          </div>
          <div style="display:table-cell;width:12px;"></div>
          <div style="display:table-cell;">
            <a href="tel:+91${cleanPhone}" 
       style="
              display: block;
              background: #F1F5F9;
              color: #334155;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 10px;
              font-weight: 700;
              font-size: 13px;
              text-align: center;
              border: 1px solid #E2E8F0;
       "
    >
      <svg width="14" height="14" 
           viewBox="0 0 24 24" 
           fill="none" 
           stroke="#334155" 
           stroke-width="2.5"
           style="vertical-align:middle;
                  margin-right:6px;">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 
                 19.79 19.79 0 0 1-8.63-3.07
                 19.5 19.5 0 0 1-6-6 
                 19.79 19.79 0 0 1-3.07-8.67
                 A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
                 12.84 12.84 0 0 0 .7 2.81 
                 2 2 0 0 1-.45 2.11L8.09 9.91
                 a16 16 0 0 0 6 6l1.27-1.27
                 a2 2 0 0 1 2.11-.45
                 12.84 12.84 0 0 0 2.81.7
                 A2 2 0 0 1 22 16.92z"/>
      </svg>
      Call ${name}: +91${cleanPhone}
            </a>
          </div>
        </div>
      `),
      attachments: [],
    });

    // Send customer acknowledgement in background to keep API response fast.
    sendMailWithTimeout({
      from: `"LIFEE Premium Water" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Application Received — LIFEE Distributor`,
      html: emailWrapper(`
        <div style="text-align:center;margin-bottom:28px;">
          <div style="
      width: 72px;
      height: 72px;
      background: #ECFDF5;
      border-radius: 50%;
      margin: 0 auto 16px;
      border: 2px solid #A7F3D0;
      text-align: center;
      line-height: 72px;
      font-size: 36px;
    ">✅</div>
          <h2 style="color:#1E293B;font-size:22px;
                     font-weight:800;margin:0 0 10px;">
            Application Received!
          </h2>
          <p style="color:#64748B;font-size:14px;
                    line-height:1.7;margin:0 auto;
                    max-width:380px;">
            Hi <strong style="color:#0EA5E9;">${name}</strong>,
            thank you for your interest in becoming
            a LIFEE Water distributor.
          </p>
        </div>

        <div style="
      background: #F8FBFF;
      border: 1px solid #DBEAFE;
      border-radius: 14px;
      padding: 24px;
      text-align: center;
      margin: 20px 0;
    ">
      <p style="
        color: #1E293B;font-size: 15px;
        font-weight: 600;margin: 0 0 8px;
      ">
        Our team will contact you within
      </p>
      <p style="
        color: #0EA5E9;font-size: 28px;
        font-weight: 800;margin: 0;
      ">48 Hours</p>
    </div>
      `),
      attachments: [],
    }).catch((ackError) => {
      console.error('Distributor ack email failed:', ackError.message);
    });

    res.json({ 
      success: true, 
      message: 'Application submitted!' 
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      error: error.message 
    });
  }
};

// --- 4. CUSTOM ORDER EMAIL ---
exports.sendCustomOrderEmail = async (req, res) => {
  const {
    contactName, phone, email,
    orderType, names, companyName, birthdayName,
    customMessage, tagline, eventDate, age,
    labelFinish, quantity, deliveryLocation,
    uploadedImage,
  } = req.body;

  if (!email || !phone || !contactName) {
    return res.status(400).json({
      success: false,
      error: 'Contact name, email and phone required'
    });
  }

  const displayName = names || companyName || birthdayName || 'Not specified';
  console.log('uploadedImage received:', 
    uploadedImage ? 
      `YES - length: ${uploadedImage.length}` : 
      'NO - not provided'
  );

  try {
    await sendMailWithTimeout({
      from: `"LIFEE Premium Water" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New ${orderType} Order — ${contactName}`,
      html: emailWrapper(`
        <div style="
          background: #EFF6FF;
          border-left: 4px solid #0EA5E9;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 28px;
        ">
          <p style="color:#0EA5E9;font-weight:700;
                    font-size:13px;margin:0 0 2px;">
            New ${orderType} Custom Order
          </p>
          <p style="color:#64748B;font-size:12px;margin:0;">
            Received from ${contactName}
          </p>
        </div>

        <p style="color:#0EA5E9;font-size:11px;font-weight:700;
                  text-transform:uppercase;letter-spacing:1.5px;
                  margin:0 0 8px;">
          Contact Details
        </p>
        ${infoCard([
          { icon:'👤', label:'Contact Person', value: contactName },
          { icon:'📧', label:'Email', value: email },
          { icon:'📱', label:'Phone', value: phone },
        ])}

        <p style="color:#0EA5E9;font-size:11px;font-weight:700;
                  text-transform:uppercase;letter-spacing:1.5px;
                  margin:20px 0 8px;">
          Order Details
        </p>
        ${infoCard([
          { icon:'🎯', label:'Order Type', value: orderType },
          { icon:'👤', label:'Name on Bottle', value: displayName },
          { icon:'💬', label:'Message / Tagline', value: customMessage || tagline || 'None' },
          { icon:'📅', label:'Event Date', value: eventDate || 'Not specified' },
          ...(age ? [{ icon:'📅', label:'Age', value: age }] : []),
          { icon:'✨', label:'Label Finish', value: labelFinish || 'Not specified' },
          { icon:'📦', label:'Quantity', value: quantity || 'Not specified' },
          { icon:'📍', label:'Delivery Location', value: deliveryLocation || 'Not specified' },
        ])}

        ${uploadedImage ? `
          <p style="color:#0EA5E9;font-size:11px;font-weight:700;
                    text-transform:uppercase;letter-spacing:1.5px;
                    margin:20px 0 8px;">
            Customer Uploaded Photo
          </p>
          <div style="
            background: #F8FBFF;
            border: 1px solid #DBEAFE;
            border-radius: 14px;
            padding: 16px;
            text-align: center;
          ">
            <img
              src="cid:customerUpload"
              alt="Customer Upload"
              style="
                max-width: 100%;
                max-height: 300px;
                border-radius: 10px;
                object-fit: contain;
                display: block;
                margin: 0 auto;
              "
            />
            <p style="
              color: #94A3B8;font-size: 11px;
              margin: 10px 0 0;
            ">
              Uploaded by ${contactName}
            </p>
          </div>
        ` : ''}

        <div style="text-align:center;margin-top:24px;">
          <a href="mailto:${email}" style="
            display:inline-block;
            background:linear-gradient(135deg,#0EA5E9,#06B6D4);
            color:white;text-decoration:none;
            padding:14px 36px;border-radius:50px;
            font-weight:700;font-size:14px;
          ">Reply to ${contactName}</a>
        </div>
      `),
      attachments: uploadedImage ? [
        {
          filename: `photo-${contactName}.png`,
          content: Buffer.from(
            uploadedImage.replace(
              /^data:image\/\w+;base64,/,
              ''
            ),
            'base64'
          ),
          cid: 'customerUpload',
          contentType: 'image/png',
          contentDisposition: 'inline',
        }
      ] : [],
    });

    // Send customer acknowledgement in background to keep API response fast.
    sendMailWithTimeout({
      from: `"LIFEE Premium Water" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your ${orderType} Order Received — LIFEE`,
      html: emailWrapper(`
        <div style="text-align:center;margin-bottom:28px;">
          <div style="
      width: 72px;height: 72px;
      background: #FFF7ED;border-radius: 50%;
      margin: 0 auto 16px;
      border: 2px solid #FED7AA;
      text-align: center;line-height: 72px;
      font-size: 36px;
    ">🎉</div>
          <h2 style="color:#1E293B;font-size:22px;
                     font-weight:800;margin:0 0 10px;">
            Order Submitted!
          </h2>
          <p style="color:#64748B;font-size:14px;
                    line-height:1.7;margin:0 auto;
                    max-width:380px;">
            Hi <strong style="color:#0EA5E9;">${contactName}</strong>,
            your ${orderType} custom bottle order 
            for <strong style="color:#0EA5E9;">${displayName}</strong> has been received.
          </p>
        </div>

        <p style="color:#0EA5E9;font-size:11px;font-weight:700;
                  text-transform:uppercase;letter-spacing:1.5px;
                  margin:0 0 8px;">
          Your Order Summary
        </p>
        ${infoCard([
          { icon:'🎯', label:'Order Type', value: orderType },
          { icon:'👤', label:'Name on Bottle', value: displayName },
          { icon:'📦', label:'Quantity', value: quantity || 'To be confirmed' },
          { icon:'📍', label:'Delivery Location', value: deliveryLocation || 'To be confirmed' },
          { icon:'📅', label:'Event Date', value: eventDate || 'To be confirmed' },
        ])}

        <div style="
          background:linear-gradient(135deg,#EFF6FF,#F0FDFF);
          border:1px solid #BFDBFE;border-radius:14px;
          padding:20px;text-align:center;margin:20px 0;
        ">
          <p style="color:#64748B;font-size:11px;
                    text-transform:uppercase;letter-spacing:1px;
                    margin:0 0 8px;">
            Our team will call you at
          </p>
          <p style="color:#0EA5E9;font-size:20px;
                    font-weight:800;margin:0;">
            ${phone}
          </p>
          <p style="color:#94A3B8;font-size:11px;
                    margin:6px 0 0;">
            Within 24 hours
          </p>
        </div>
      `),
      attachments: [],
    }).catch((ackError) => {
      console.error('Custom order ack email failed:', ackError.message);
    });

    res.json({
      success: true,
      message: 'Order submitted successfully!'
    });

  } catch (error) {
    console.error('Custom Order Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

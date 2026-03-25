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

// --- 1. CONTACT FORM EMAIL ---
exports.sendContactEmail = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, message'
    });
  }

  try {
    // Notify admin
    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Contact Form - ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || 'Not provided'}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    // Confirm to user
    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank you for contacting LIFEE Water',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for reaching out to LIFEE Premium Water.</p>
        <p>We have received your message and will get back
           to you within 24 hours.</p>
        <br/>
        <p>Best Regards,</p>
        <p><b>LIFEE Premium Water Team</b></p>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
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
    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
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
    });

    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
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

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, phone'
    });
  }

  try {
    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Distributor Application - ${name}`,
      html: `
        <h2>New Distributor Application</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>City:</b> ${city || 'Not provided'}</p>
        <p><b>Business Name:</b>
           ${businessName || 'Not provided'}</p>
      `,
    });

    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Distributor Application Received - LIFEE Water',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for your interest in becoming a
           LIFEE Water distributor.</p>
        <p>Our team will review your application and
           contact you within 48 hours.</p>
        <br/>
        <p><b>LIFEE Premium Water Team</b></p>
      `,
    });

    res.json({ success: true, message: 'Application submitted!' });
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

// --- 4. CUSTOM ORDER EMAIL ---
exports.sendCustomOrderEmail = async (req, res) => {
  const { name, email, phone, orderType, quantity, eventDate, customMessage } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, phone'
    });
  }

  try {
    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Custom Order - ${orderType} - ${name}`,
      html: `
        <h2>New Custom Order Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Order Type:</b> ${orderType || 'Not specified'}</p>
        <p><b>Quantity:</b> ${quantity || 'Not specified'}</p>
        <p><b>Event Date:</b> ${eventDate || 'Not specified'}</p>
        <p><b>Custom Message:</b>
           ${customMessage || 'None'}</p>
      `,
    });

    await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Custom Order Received - LIFEE Water',
      html: `
        <h2>Hi ${name},</h2>
        <p>We received your custom order request
           for ${orderType || 'custom bottles'}.</p>
        <p>Our design team will contact you within
           24 hours to discuss your requirements.</p>
        <br/>
        <p><b>LIFEE Premium Water Team</b></p>
      `,
    });

    res.json({ success: true, message: 'Custom order submitted!' });
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

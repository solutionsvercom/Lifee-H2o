const express = require('express');
const router = express.Router();
const {
  sendContactEmail,
  sendOrderEmail,
  sendDistributorEmail,
  sendCustomOrderEmail,
} = require('../controllers/emailController');

router.post('/contact', sendContactEmail);
router.post('/order', sendOrderEmail);
router.post('/distributor', sendDistributorEmail);
router.post('/custom-order', sendCustomOrderEmail);

module.exports = router;

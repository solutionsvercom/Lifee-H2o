const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

export const API_ENDPOINTS = {
  contact: `${API_BASE_URL}/api/email/contact`,
  order: `${API_BASE_URL}/api/email/order`,
  distributor: `${API_BASE_URL}/api/email/distributor`,
  customOrder: `${API_BASE_URL}/api/email/custom-order`,
  downloadCard: `${API_BASE_URL}/api/download/visiting-card`,
};

export default API_BASE_URL;

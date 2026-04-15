import { apiUrl } from '../app/utils/apiUrl';

const API_BASE_URL = apiUrl('/').replace(/\/$/, '');

export const API_ENDPOINTS = {
  contact: apiUrl('/api/email/contact'),
  order: apiUrl('/api/email/order'),
  distributor: apiUrl('/api/email/distributor'),
  customOrder: apiUrl('/api/email/custom-order'),
  downloadCard: apiUrl('/api/download/visiting-card'),
};

export default API_BASE_URL;

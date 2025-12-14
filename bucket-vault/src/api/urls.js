const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/finance';

export const API_URLS = {
  // Auth endpoints
  login: `${API_BASE}/login/`,
  signup: `${API_BASE}/api/finance/auth/signup/`,
  logout: `${API_BASE}/logout/`,

  // Portfolio endpoints
  get_portfolio_list: `${API_BASE}/get-portfolio-list/`,
  create_portfolio: `${API_BASE}/create-portfolio/`,

  // Account endpoints
  accounts: `${API_BASE}/accounts/`,
  transactions: `${API_BASE}/transactions/`,
  create_account: `${API_BASE}/create-account/`,
  
  // Dropdown data endpoints
  account_types: `${API_BASE}/account-types/`,
  categories: `${API_BASE}/categories/`,
  buckets: `${API_BASE}/buckets/`,
  
  // Create new endpoints
  create_account_type: `${API_BASE}/account-types/create/`,
  create_category: `${API_BASE}/categories/create/`,
  create_bucket: `${API_BASE}/buckets/create/`,
};

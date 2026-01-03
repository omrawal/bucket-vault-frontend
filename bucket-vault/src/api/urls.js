const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/finance';

export const API_URLS = {
  // Auth endpoints
  login: `${API_BASE}/login/`,
  signup: `${API_BASE}/api/finance/auth/signup/`,
  logout: `${API_BASE}/logout/`,

  // Portfolio endpoints
  get_portfolio_list: `${API_BASE}/get-portfolio-list/`,
  create_portfolio: `${API_BASE}/create-portfolio/`,
  delete_portfolio: `${API_BASE}/delete-portfolio/`,
  get_total_networth: `${API_BASE}/get-total-networth/`,

  // Account endpoints
  get_all_accounts: `${API_BASE}/get-all-accounts/`,
  get_all_transactions: `${API_BASE}/get-all-transactions/`,
  create_account: `${API_BASE}/create-account/`,
  create_transaction: `${API_BASE}/create-transaction/`,
  get_account_types: `${API_BASE}/get-account-types/`,
  get_transaction_types: `${API_BASE}/get-transaction-types/`,
  get_transaction_categories: `${API_BASE}/get-transaction-categories/`,
  get_transaction_subcategories: `${API_BASE}/get-transaction-subcategories/`,

  get_account_categories: `${API_BASE}/get-account-categories/`,
  get_bucket_types: `${API_BASE}/get-bucket-types/`,
  
  // Create new endpoints
  create_account_type: `${API_BASE}/account-types/create/`,
  create_category: `${API_BASE}/categories/create/`,
  create_bucket: `${API_BASE}/buckets/create/`,
};

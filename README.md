# Bucket Vault Frontend

A modern React dashboard for personal finance tracking. Manage portfolios, accounts, and transactions with beautiful charts, real-time balance updates, and smart financial analytics.

**[🎬 Watch Demo Video](#demo)** | **[🚀 Live App](#live-app)** | **[📦 Backend Repo](#backend)** | **[🔧 Tech Stack](#tech-stack)**

---

## Live App

🌐 **Frontend (Live):** https://bucket-vault-frontend.vercel.app  
🔌 **Backend API:** https://bucket-vault-backend.onrender.com  
📚 **Backend Repo:** https://github.com/omrawal/bucket-vault-backend

---

## Demo

<a name="demo"></a>

▶️ **Full walkthrough video** (YouTube):

[![Video](https://img.youtube.com/vi/84DRh-DOnF8/0.jpg)](https://www.youtube.com/watch?v=84DRh-DOnF8)

**Watch the full demo:** https://www.youtube.com/watch?v=84DRh-DOnF8

In this video, I walk through:
- Portfolio & account management
- Adding income, expenses, and transfers
- Searchable category dropdown
- Statistics dashboard with 20 months of dummy data
- Tech stack overview

---

## Features

✨ **Portfolio Management** - Create and switch between multiple financial portfolios  
✨ **Account Dashboard** - View all accounts organized by type and bucket (Growth/Safety)  
✨ **Smart Transactions** - Add income, expenses, and transfers with searchable category dropdown  
✨ **Real-Time Updates** - Account balances auto-update on transaction creation  
✨ **Statistics Dashboard** - Beautiful charts showing:
  - Income vs Expenses (monthly trend)
  - Category breakdown (pie chart)
  - Net worth over time (line graph)
  - Account-wise balance distribution  
✨ **Responsive Design** - Works on desktop, tablet, and mobile  
✨ **Accessible UI** - Floating labels, keyboard navigation, proper focus management  
✨ **Dark Mode Ready** - CSS variables for theme switching  
✨ **Production Ready** - Deployed on Vercel with PostgreSQL backend

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18.x + Vite |
| **UI Components** | Custom components + CSS design system |
| **State** | React Context API |
| **HTTP** | Axios |
| **Charts** | Chart.js / Plotly.js |
| **Styling** | CSS Variables + Flexbox/Grid |
| **Deployment** | Vercel |
| **Backend** | Django 4.x + Django REST Framework |
| **Database** | PostgreSQL |
| **Backend Deployment** | Render (Always Free) |

---

## Project Structure

```
bucket-vault-frontend/
├── src/
│   ├── api/
│   │   ├── client.js              # Axios instance with base URL
│   │   └── urls.js                # API endpoint definitions
│   ├── components/
│   │   ├── FormField.jsx           # Reusable searchable form field
│   │   ├── Button.jsx              # Button component
│   │   ├── CreateTransactionModal.jsx
│   │   ├── PortfolioSelector.jsx
│   │   ├── TransactionList.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main portfolio dashboard
│   │   ├── Transactions.jsx        # Transaction list & filters
│   │   ├── Statistics.jsx          # Analytics dashboard
│   │   ├── Accounts.jsx            # Account management
│   │   └── Portfolios.jsx          # Portfolio setup
│   ├── context/
│   │   └── PortfolioContext.jsx   # Global portfolio state
│   ├── styles/
│   │   ├── design-system.css       # Colors, spacing, typography
│   │   ├── global.css              # Base styles
│   │   └── components.css          # Component styles
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── .env.example
├── public/
├── index.html
├── vite.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

### 1. Clone Repository

```bash
git clone https://github.com/omrawal/bucket-vault-frontend.git
cd bucket-vault-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# API Base URL (update to your backend URL)
VITE_API_URL=http://localhost:8000

# Optional: Analytics, error tracking
VITE_APP_VERSION=1.0.0
```

For **production** (deployed on Vercel):

```env
VITE_API_URL=https://bucket-vault-backend.onrender.com
```

### 4. Start Development Server

```bash
npm run dev
```

App runs at **http://localhost:5173** with HMR (Hot Module Replacement)

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR (hot reload)

# Production
npm run build            # Build optimized bundle for production
npm run preview          # Preview production build locally

# Code Quality (if configured)
npm run lint             # Run ESLint
npm run format           # Run Prettier formatting

# Dependencies
npm list                 # Show installed packages
npm audit                # Check for security vulnerabilities
```

---

## Key Components

### FormField.jsx (Reusable Input Component)

Supports multiple input types with a unified API:

| Type | Description | Use Case |
|------|-------------|----------|
| `text` | Standard text input | Names, notes, descriptions |
| `textarea` | Multi-line text | Longer descriptions |
| `select` | Dropdown select | Fixed options list |
| `multiselect` | Multiple selection | Tags, multiple accounts |
| **`searchable`** | Searchable dropdown + custom entry | Categories, accounts |

**Example Usage:**

```jsx
import FormField from './components/FormField';

export default function TransactionForm() {
  const [formData, setFormData] = useState({ category: '' });
  
  return (
    <FormField
      type="searchable"
      name="category"
      label="Category"
      value={formData.category}
      onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
      searchableOptions={[
        { label: 'Salary', value: 'salary', is_default: true },
        { label: 'Freelance', value: 'freelance' },
        { label: 'Rent', value: 'rent' },
      ]}
      placeholder="Type or select category"
      required
    />
  );
}
```

### CreateTransactionModal.jsx

Modal form for adding transactions with intelligent field management:

```jsx
<CreateTransactionModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={() => {
    // Refresh transactions
    fetchTransactions();
    setShowModal(false);
  }}
/>
```

**Supports:**
- Income, Expense, and Transfer transactions
- Dynamic form fields based on transaction type
- Searchable category field with custom entry
- Auto-updated account balances via API
- Date picker with validation
- Real-time error feedback

### Statistics.jsx (Analytics Dashboard)

Visualizes financial data with multiple chart types:

```jsx
import Statistics from './pages/Statistics';

export default function App() {
  return (
    <div>
      <Statistics portfolioId={1} />
    </div>
  );
}
```

**Charts Included:**
- **Income vs Expenses** - Monthly comparison line/bar chart
- **Category Breakdown** - Pie chart of spending distribution
- **Net Worth Trend** - Line graph showing growth over time
- **Account Distribution** - Donut chart of net worth by account type
- **Date Range Filtering** - Customizable start & end dates
- **Category Filters** - Filter by expense category

---

## API Integration

### Axios Configuration

```javascript
// src/api/client.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for auth token (if needed)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### API Endpoints Reference

**Full documentation:** https://github.com/omrawal/bucket-vault-backend

```javascript
// Portfolios
GET    /api/portfolios/                    # List all portfolios
POST   /api/portfolios/                    # Create portfolio
GET    /api/portfolios/{id}/               # Get portfolio details
PUT    /api/portfolios/{id}/               # Update portfolio
DELETE /api/portfolios/{id}/               # Delete portfolio

// Accounts
GET    /api/accounts/?portfolio_id=1       # List accounts for portfolio
POST   /api/accounts/                      # Create account
GET    /api/accounts/{id}/                 # Get account details
PUT    /api/accounts/{id}/                 # Update account
DELETE /api/accounts/{id}/                 # Delete account

// Transactions
GET    /api/transactions/?account_id=1     # List transactions
POST   /api/transactions/                  # Create transaction (income/expense)
GET    /api/transactions/{id}/             # Get transaction details
PUT    /api/transactions/{id}/             # Update transaction
DELETE /api/transactions/{id}/             # Delete transaction

// Transfers (special endpoint for inter-account transfers)
POST   /api/transfers/                     # Create transfer (creates 2 transactions)
  {
    from_account_id: 1,
    to_account_id: 2,
    amount: 15000,
    date: "2026-02-12",
    note: "MF SIP"
  }

// Categories
GET    /api/transaction-categories/?portfolio_id=1    # List categories
POST   /api/transaction-categories/                    # Create custom category

// Statistics
GET    /api/statistics/?portfolio_id=1&date_from=2024-01-01&date_to=2026-02-12
  # Returns aggregated income, expenses, net worth, category breakdown
```

### Example API Calls

```javascript
import apiClient from '../api/client';

// Fetch all portfolios
export const fetchPortfolios = async () => {
  const res = await apiClient.get('/api/portfolios/');
  return res.data;
};

// Fetch accounts for a portfolio
export const fetchAccounts = async (portfolioId) => {
  const res = await apiClient.get(`/api/accounts/?portfolio_id=${portfolioId}`);
  return res.data;
};

// Create a transaction
export const createTransaction = async (data) => {
  const res = await apiClient.post('/api/transactions/', {
    account_id: data.accountId,
    type: data.type, // 'Credit' or 'Debit'
    amount: data.amount,
    category: data.category,
    date: data.date,
    note: data.note || '',
  });
  return res.data;
};

// Create a transfer
export const createTransfer = async (fromAccountId, toAccountId, amount, date) => {
  const res = await apiClient.post('/api/transfers/', {
    from_account_id: fromAccountId,
    to_account_id: toAccountId,
    amount,
    date,
  });
  return res.data;
};

// Fetch statistics
export const fetchStatistics = async (portfolioId, dateFrom, dateTo) => {
  const res = await apiClient.get('/api/statistics/', {
    params: {
      portfolio_id: portfolioId,
      date_from: dateFrom,
      date_to: dateTo,
    },
  });
  return res.data;
};
```

---

## Design System

### Color Variables

```css
:root {
  /* Semantic Colors */
  --color-primary: #218 08D;        /* Teal */
  --color-primary-hover: #1d7477;
  --color-success: #22C55E;         /* Green */
  --color-error: #C01530;           /* Red */
  --color-error-light: #FF5459;
  --color-warning: #A84B2F;         /* Orange */
  
  /* Backgrounds */
  --color-bg-primary: #FCFCF9;      /* Cream */
  --color-bg-secondary: #1F2121;    /* Charcoal */
  --color-surface: #FFFFFF;
  
  /* Text */
  --color-text-primary: #134252;    /* Dark Slate */
  --color-text-secondary: #627077;  /* Gray */
  --color-text-muted: #999;
  
  /* Borders */
  --color-border: #E5E7EB;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
}
```

### Typography

```css
/* Font Family */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'Berkeley Mono', 'Monaco', monospace;

/* Scale */
h1: 32px, weight 600
h2: 24px, weight 600
h3: 20px, weight 600
h4: 18px, weight 500
body: 14px, weight 400
small: 12px, weight 400
```

### Spacing Scale

```css
--space-4: 4px
--space-8: 8px
--space-12: 12px
--space-16: 16px
--space-24: 24px
--space-32: 32px
--space-48: 48px
```

---

## Deployment

### Deploy to Vercel

**Option 1: Auto-deploy from GitHub (Recommended)**

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New...** → **Project**
3. Select `bucket-vault-frontend` repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave empty)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://bucket-vault-backend.onrender.com
   ```
6. Click **Deploy**

Your app is now live at `https://bucket-vault-frontend.vercel.app` 🎉

**Option 2: Manual CLI deployment**

```bash
npm install -g vercel
npm run build
vercel --prod
```

### Environment Variables on Vercel

1. Go to Project Settings → Environment Variables
2. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://bucket-vault-backend.onrender.com`
3. Redeploy: Click "Deploy" again

---

## Development Workflow

### Adding a New Feature

1. **Create a branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Create page/component:**
   ```bash
   # Create new page
   touch src/pages/NewFeature.jsx
   
   # Or create reusable component
   touch src/components/NewComponent.jsx
   ```

3. **Add to App.jsx or parent component**

4. **Test locally:**
   ```bash
   npm run dev
   ```

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request on GitHub**

### Connecting to Backend

Update `src/api/client.js` with your backend URL:

```javascript
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  'http://localhost:8000';
```

For local development, backend should run on `http://localhost:8000`

For production, update Vercel environment variables to point to Render backend.

### Using Context API for State

```jsx
// src/context/PortfolioContext.jsx
import { createContext, useContext, useState } from 'react';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  
  return (
    <PortfolioContext.Provider value={{ selectedPortfolio, setSelectedPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}

// Usage in component
import { usePortfolio } from '../context/PortfolioContext';

export default function MyComponent() {
  const { selectedPortfolio } = usePortfolio();
  // ...
}
```

---

## Performance Optimization

### Memoization

```jsx
import { memo } from 'react';

const AccountCard = memo(function AccountCard({ account }) {
  return <div>{account.name}: ₹{account.balance}</div>;
});

export default AccountCard;
```

### Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

const Statistics = lazy(() => import('./pages/Statistics'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Statistics />
    </Suspense>
  );
}
```

### Debouncing Search

```jsx
import { useCallback, useState } from 'react';

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = useCallback((value) => {
    // Debounce search API call
    const timer = setTimeout(() => {
      // Make API call with value
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <input 
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

## Troubleshooting

### API Connection Error

**Symptom:** "Failed to fetch from API" or CORS error

**Solution:**

1. Check `VITE_API_URL` in `.env.local`:
   ```javascript
   console.log(import.meta.env.VITE_API_URL);
   ```

2. Verify backend is running:
   ```bash
   curl http://localhost:8000/api/portfolios/
   ```

3. Check backend `CORS_ALLOWED_ORIGINS`:
   ```python
   # settings.py
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",  # Local dev
       "https://bucket-vault-frontend.vercel.app",  # Production
   ]
   ```

### Hot Module Replacement (HMR) Not Working

**Solution:**

1. Check Vite config `vite.config.js`:
   ```javascript
   export default {
     server: {
       hmr: true,
     },
   };
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

### Build Fails

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist/
npm install
npm run build

# Check for TypeScript errors
npm run lint
```

### Dark Mode Not Switching

**Solution:** Check if `data-color-scheme` attribute is set on `<html>`:

```javascript
// Add to your theme switcher
document.documentElement.setAttribute('data-color-scheme', 'dark');
```

---

## Browser Support

| Browser | Min Version | Status |
|---------|------------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| IE 11 | N/A | ❌ Not supported |

---

## Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes** and test locally
4. **Commit with clear message:**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push and create Pull Request**

Please ensure:
- Code follows project style
- No console errors/warnings
- Components are reusable where possible
- API calls are centralized

---

## Roadmap

- [x] Portfolio management
- [x] Transaction tracking
- [x] Searchable category dropdown
- [x] Statistics dashboard
- [x] Deployment on Vercel
- [ ] Dark mode toggle
- [ ] Budget alerts
- [ ] Recurring transactions
- [ ] CSV/PDF export
- [ ] User authentication
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] AI-powered spending insights

---

## Security

- **Environment variables:** Never commit `.env.local` or secrets
- **API keys:** Store in Vercel Environment Variables, not in code
- **CORS:** Backend only allows requests from authorized origins
- **Input validation:** All form inputs validated on frontend & backend

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Resources

- **Backend Repository:** https://github.com/omrawal/bucket-vault-backend
- **Live App:** https://bucket-vault-frontend.vercel.app
- **Live API:** https://bucket-vault-backend.onrender.com
- **Demo Video:** https://www.youtube.com/watch?v=84DRh-DOnF8
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Vercel Docs:** https://vercel.com/docs

---

## Support & Feedback

Found a bug or have a suggestion?

- **GitHub Issues:** https://github.com/omrawal/bucket-vault-frontend/issues
- **LinkedIn:** https://linkedin.com/in/omrawal
- **Email:** omrawal2801@gmail.com

---

## Author

**Om Rawal** - Full-Stack Software Engineer

- 🔗 **GitHub:** https://github.com/omrawal
- 💼 **LinkedIn:** https://linkedin.com/in/omrawal
- 📧 **Email:** omrawal2801@gmail.com

---

**Built with React + Vite ⚡ | Deployed on Vercel 🚀**

*Last updated: February 2026*

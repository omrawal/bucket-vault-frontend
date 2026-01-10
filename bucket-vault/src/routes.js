import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export const ROUTES = {
    login: {
        key: 'login',
        label: 'Login',
        component: LoginPage,
        isAuth: true,
    },
    register: {
        key: 'register',
        label: 'Register',
        component: RegisterPage,
        isAuth: true,
    },
    dashboard: {
        key: 'dashboard',
        label: 'Dashboard',
        component: DashboardPage,
    },
    accounts: {
        key: 'accounts',
        label: 'Accounts',
        component: AccountsPage,
    },
    transactions: {
        key: 'transactions',
        label: 'Transactions',
        component: TransactionsPage,
    },
    statistics: {
        key: 'statistics',
        label: 'Statistics',
        component: StatisticsPage,
    },
};

// Optionally export as array (useful for Sidebar)
export const ROUTE_LIST = Object.values(ROUTES);

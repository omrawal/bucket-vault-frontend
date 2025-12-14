import React from 'react';
import { useState } from 'react';
import Sidebar from './layout/Sidebar.jsx';
import Topbar from './layout/Topbar.jsx';
import { ROUTES } from './routes.js';
import './styles.css';

function App() {
  const [route, setRoute] = useState('dashboard');

  const CurrentPage = ROUTES[route]?.component;
  const isAuthRoute = ROUTES[route]?.isAuth;

  return (
    <div className="app-root">
      <Sidebar current={route} onNavigate={setRoute} />
      <div className="app-main">
        <Topbar />
        <main className="app-content">
          <CurrentPage onRouteChange={setRoute} />
        </main>
      </div>
    </div>
  );
}

export default App;

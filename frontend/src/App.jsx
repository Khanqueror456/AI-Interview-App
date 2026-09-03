import React from 'react'

import AppRoutes from './routes/AppRoutes'
import Resumes from './pages/Resumes';
import MessageDialog from './components/layout/MessageDialog';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';

const App = () => {
  return <AppRoutes />
  // return <MessageDialog />
  // return <Dashboard />
};

export default App;

import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/main/Home';
import Division from './pages/main/division';
import AuthLogin from './pages/auth/login';
import AuthLayout from './components/auth/layout';
import Company from './pages/main/company';
import AuthRegister from './pages/auth/register';
import Dashboard from './pages/main/Dashboard';
import NotFound from './pages/other/NotFound'

const App = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />}/>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<AuthLogin />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<AuthLogin />} />
        <Route path="register" element={<AuthRegister />} />
      </Route>

      <Route path="/" element={<Home />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="company" element={<Company />}>
          <Route path="division" element={<Division />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App
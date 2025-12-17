
import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PatientList } from './pages/PatientList';
import { PatientDetail } from './pages/PatientDetail';
import { Finance } from './pages/Finance';
import { AppointmentCreate } from './pages/AppointmentCreate';
import { SessionCreate } from './pages/SessionCreate';
import { AppointmentExecute } from './pages/AppointmentExecute';
import { Agenda } from './pages/Agenda';
import { PatientCreate } from './pages/PatientCreate';

const Layout: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 bg-background-light dark:bg-background-dark overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/patients/new" element={<PatientCreate />} />

          <Route path="/agenda" element={<Agenda />} />

          <Route path="/appointments/new" element={<AppointmentCreate />} />
          <Route path="/appointments/execute" element={<AppointmentExecute />} />
          <Route path="/appointments/:id" element={<AppointmentExecute />} />

          <Route path="/sessions/new" element={<SessionCreate />} />

          <Route path="/finance" element={<Finance />} />
        </Route>
      </Routes>
    </Router>
  );
}

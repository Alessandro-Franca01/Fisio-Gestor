import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PatientList } from './pages/PatientList';
import { PatientDetail } from './pages/PatientDetail';
import { PatientCreate } from './pages/PatientCreate';
import { Finance } from './pages/Finance';
import { AppointmentCreate } from './pages/AppointmentCreate';
import { SessionCreate } from './pages/SessionCreate';
import { SessionList } from './pages/SessionList';
import { SessionDetail } from './pages/SessionDetail';
import { SessionEdit } from './pages/SessionEdit';
import { AppointmentExecute } from './pages/AppointmentExecute';
import { Agenda } from './pages/Agenda';

const Layout: React.FC = () => {
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
          
          <Route path="/sessions" element={<SessionList />} />
          <Route path="/sessions/new" element={<SessionCreate />} />
          <Route path="/sessions/:id" element={<SessionDetail />} />
          <Route path="/sessions/:id/edit" element={<SessionEdit />} />
          
          <Route path="/finance" element={<Finance />} />
        </Route>
      </Routes>
    </Router>
  );
}
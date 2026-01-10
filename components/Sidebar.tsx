
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    navigate('/');
  };

  const navItemClass = (path: string) => `
    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
    ${isActive(path) 
      ? 'bg-primary/20 text-text-light dark:text-text-dark font-medium' 
      : 'text-text-light dark:text-text-dark hover:bg-primary/10'}
  `;

  return (
    <aside className="hidden md:flex h-screen flex-col justify-between bg-surface-light dark:bg-surface-dark p-4 border-r border-border-light dark:border-border-dark w-64 sticky top-0">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-2">
          <div className="size-8 text-primary">
             <Icon name="exercise" className="text-3xl" />
          </div>
          <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">FisioGestor</h2>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          <Link to="/dashboard" className={navItemClass('/dashboard')}>
            <Icon name="dashboard" filled={isActive('/dashboard')} />
            <p className="text-sm leading-normal">Dashboard</p>
          </Link>
          <Link to="/patients" className={navItemClass('/patients')}>
            <Icon name="group" filled={isActive('/patients')} />
            <p className="text-sm leading-normal">Pacientes</p>
          </Link>
          <Link to="/sessions" className={navItemClass('/sessions')}>
            <Icon name="assignment" filled={isActive('/sessions')} />
            <p className="text-sm leading-normal">Sessões</p>
          </Link>
          <Link to="/agenda" className={navItemClass('/agenda')}>
            <Icon name="calendar_month" filled={isActive('/agenda')} />
            <p className="text-sm leading-normal">Agenda</p>
          </Link>
          <Link to="/finance" className={navItemClass('/finance')}>
            <Icon name="payments" filled={isActive('/finance')} />
            <p className="text-sm leading-normal">Financeiro</p>
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <Link to="/settings" className={navItemClass('/settings')}>
          <Icon name="settings" filled={isActive('/settings')} />
          <p className="text-sm font-medium leading-normal">Configurações</p>
        </Link>
        
        <div className="border-t border-border-light dark:border-border-dark my-2"></div>

        <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-primary/5 rounded-lg" onClick={handleLogout}>
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5AZbSrlSGMK-_WSpDWBRT1Q_MiSGH9YO8xWvVupGoWzjxi0aQCR8DhRaT7kY9pQFl7PNdi93AiUUQwCySQuV-48qBnEqy31MwMh0t0ifFRX_Q_Nl0vzNTJ8Qyy1zSdYnJ1l6TbqQme7RafgJ6Tne2gQN8l28x7BhPqoHPzCNFUqGFzPaLP4E27AwSvr-fwE43kJXp9AZDIUIul5S6FB-YFKSpL4oPQ_ef8c89vkRGUWW5JHdCdUCVYmR8lWT6Levwmckq_Onj3y0")' }}
          ></div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-text-light dark:text-text-dark text-sm font-medium leading-normal truncate">Dr. Carlos Silva</h1>
            <p className="text-subtle-light dark:text-subtle-dark text-xs font-normal leading-normal truncate">Fisioterapeuta</p>
          </div>
          <Icon name="logout" className="ml-auto text-subtle-light dark:text-subtle-dark text-lg" />
        </div>
      </div>
    </aside>
  );
};

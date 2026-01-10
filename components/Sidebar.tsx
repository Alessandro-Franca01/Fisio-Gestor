import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 h-screen flex-col justify-between bg-surface-light dark:bg-surface-dark p-4 border-r border-border-light dark:border-border-dark w-64 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <div className="size-8 text-primary">
                <Icon name="exercise" className="text-3xl" />
              </div>
              <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">FisioGestor</h2>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-black/5 rounded-full"
            >
              <Icon name="close" className="text-text-light dark:text-text-dark" />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            <Link to="/dashboard" className={navItemClass('/dashboard')} onClick={onClose}>
              <Icon name="dashboard" filled={isActive('/dashboard')} />
              <p className="text-sm leading-normal">Dashboard</p>
            </Link>
            <Link to="/patients" className={navItemClass('/patients')} onClick={onClose}>
              <Icon name="group" filled={isActive('/patients')} />
              <p className="text-sm leading-normal">Pacientes</p>
            </Link>
            <Link to="/sessions" className={navItemClass('/sessions')} onClick={onClose}>
              <Icon name="assignment" filled={isActive('/sessions')} />
              <p className="text-sm leading-normal">Sessões</p>
            </Link>
            <Link to="/agenda" className={navItemClass('/agenda')} onClick={onClose}>
              <Icon name="calendar_month" filled={isActive('/agenda')} />
              <p className="text-sm leading-normal">Agenda</p>
            </Link>
            <Link to="/finance" className={navItemClass('/finance')} onClick={onClose}>
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
            <div className="size-10 rounded-full bg-surface-light dark:bg-surface-dark border-4 border-primary/20 flex items-center justify-center text-subtle-light dark:text-subtle-dark">
              <Icon name="person" className="text-2xl" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-text-light dark:text-text-dark text-sm font-medium leading-normal truncate">Dr. Carlos Silva</h1>
              <p className="text-subtle-light dark:text-subtle-dark text-xs font-normal leading-normal truncate">Fisioterapeuta</p>
            </div>
            <Icon name="logout" className="ml-auto text-subtle-light dark:text-subtle-dark text-lg" />
          </div>
        </div>
      </aside>
    </>
  );
};
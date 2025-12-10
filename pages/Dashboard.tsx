import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface DashboardData {
  financial: {
    total_to_receive: number;
    monthly_revenue: number;
  };
  upcoming_appointments: Array<{
    id: number;
    patient: { name: string };
    date: string;
    scheduled_time: string;
    location: string;
  }>;
  pending_appointments: Array<{
    id: number;
    patient: { name: string };
    date: string;
    status: string;
  }>;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        const response = await api.get('/dashboard');
        console.log('Dashboard data received:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-subtle-light dark:text-subtle-dark">Carregando...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Erro ao carregar dados. Verifique o console.</div>
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-black tracking-[-0.033em] text-text-light dark:text-text-dark">Dashboard</h1>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/appointments/new')} className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold text-background-dark hover:bg-opacity-90 transition-colors">
            <Icon name="add_circle" />
            <span className="truncate">Registrar Atendimento</span>
          </button>
          <button onClick={() => navigate('/patients/new')} className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold text-text-light dark:bg-primary/30 dark:text-text-dark hover:bg-primary/30 transition-colors">
            <Icon name="person_add" />
            <span className="truncate">Adicionar Paciente</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-1 flex-col gap-2 rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark shadow-sm">
          <p className="text-base font-medium text-text-light dark:text-text-dark">Total a Receber</p>
          <p className="text-2xl font-bold tracking-tight text-text-light dark:text-text-dark">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.financial.total_to_receive || 0)}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark shadow-sm">
          <p className="text-base font-medium text-text-light dark:text-text-dark">Pagamentos do Mês</p>
          <p className="text-2xl font-bold tracking-tight text-text-light dark:text-text-dark">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.financial.monthly_revenue || 0)}
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Próximos Atendimentos */}
        <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-[-0.015em] text-text-light dark:text-text-dark">Próximos Atendimentos</h2>
            <button 
              onClick={() => navigate('/agenda')}
              className="flex h-8 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-medium text-text-light dark:bg-primary/30 dark:text-text-dark hover:bg-primary/30 transition-colors"
            >
              <span className="truncate">Ver Todos</span>
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {data?.upcoming_appointments.length === 0 ? (
              <p className="text-subtle-light dark:text-subtle-dark">Nenhum atendimento próximo.</p>
            ) : (
              data?.upcoming_appointments.map((item) => (
                <div key={item.id} className="flex items-start gap-4 rounded-lg p-3 hover:bg-primary/10 cursor-pointer transition-colors" onClick={() => navigate('/appointments/execute')}>
                  <div className="mt-1 flex size-8 items-center justify-center rounded-full bg-primary/20">
                    <Icon name="event" className="text-text-light dark:text-text-dark" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-semibold text-text-light dark:text-text-dark">{item.patient?.name}</p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">
                      {new Date(item.date).toLocaleDateString('pt-BR')} às {item.scheduled_time}
                    </p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">{item.location || 'Local não informado'}</p>
                  </div>
                  <Icon name="chevron_right" className="text-subtle-light dark:text-subtle-dark" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Atendimentos Pendentes */}
        <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-[-0.015em] text-text-light dark:text-text-dark">Atendimentos Pendentes</h2>
            <button className="flex h-8 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-medium text-text-light dark:bg-primary/30 dark:text-text-dark">
              <span className="truncate">Ver Todos</span>
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {data?.pending_appointments.length === 0 ? (
              <p className="text-subtle-light dark:text-subtle-dark">Nenhum atendimento pendente.</p>
            ) : (
              data?.pending_appointments.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg p-3 hover:bg-primary/10">
                  <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/20">
                    <Icon name="hourglass_top" className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-semibold text-text-light dark:text-text-dark">{item.patient?.name}</p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">Atendimento de {new Date(item.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">Aguardando Registro</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
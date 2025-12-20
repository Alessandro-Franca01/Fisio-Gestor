import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import sessionService, { Session } from '../services/sessionService';

export const SessionList: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'Ativa' | 'Concluída'>('Ativa');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await sessionService.getSessions({ status: filter });
        // The API returns paginated data: { data: [...], current_page: 1, ... }
        setSessions(response.data || []);
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [filter]);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Sessões e Tratamentos</h1>
          <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Gerencie os pacotes de sessões ativos e históricos.</p>
        </div>
        <button onClick={() => navigate('/sessions/new')} className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide shadow-sm hover:opacity-90">
          <Icon name="add" />
          <span className="truncate">Nova Sessão</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-border-light dark:border-border-dark">
        <button
          onClick={() => setFilter('Ativa')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${filter === 'Ativa'
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
              : 'text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark'
            }`}
        >
          Em Andamento
        </button>
        <button
          onClick={() => setFilter('Concluída')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${filter === 'Concluída'
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
              : 'text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark'
            }`}
        >
          Concluídos
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-subtle-light dark:text-subtle-dark">Carregando sessões...</p>
          </div>
        ) : sessions.map((session) => {
          const completed = session.completed_appointments_count || 0;
          const total = session.total_appointments;
          const progressPercentage = (completed / total) * 100;

          return (
            <div key={session.id} className="flex flex-col md:flex-row items-center gap-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-sm hover:border-primary/30 transition-colors">
              {/* Patient Info */}
              <div className="flex items-center gap-4 w-full md:w-auto md:min-w-64">
                <div className="flex items-center justify-center font-bold rounded-full size-12 bg-primary/10 text-primary">
                  {session.patient?.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-text-light dark:text-text-dark">{session.patient?.name || 'Paciente'}</h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Início: {new Date(session.start_date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Session Info */}
              <div className="flex-1 w-full">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-text-light dark:text-text-dark">{session.title || 'Sem título'}</span>
                  <span className="text-sm font-bold text-primary">{completed} / {total} Sessões</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => navigate(`/sessions/${session.id}/edit`)}
                  className="flex items-center justify-center size-10 rounded-lg hover:bg-primary/10 text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors"
                >
                  <Icon name="edit" />
                </button>
                <button
                  onClick={() => navigate(`/sessions/${session.id}`)}
                  className="flex items-center justify-center h-10 px-4 rounded-lg bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors"
                >
                  Detalhes
                </button>
              </div>
            </div>
          );
        })}
        {!loading && sessions.length === 0 && (
          <div className="text-center py-12 text-subtle-light dark:text-subtle-dark">
            <Icon name="check_circle" className="text-4xl mb-2 opacity-50" />
            <p>Nenhuma sessão encontrada nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

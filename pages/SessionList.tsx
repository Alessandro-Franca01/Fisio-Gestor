import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const SessionList: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'active' | 'completed'>('active');

  const sessions = [
    {
      id: '1',
      patientName: 'Ana Silva',
      patientImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoVNHh_7znLCdQuCsAZ5_4gMgxSWQ0yCq3vlkFdDapohyRDFG5YpXhpoFz9t5PZhKM42Vxw_sSP8dzswCmIKzsQgD1X-rJyJ5DrJ6QFUZuMS0aKt2h6bkmHB3uCMWk2YHZZDaNnsvU-4z4MtTHXCRBl69aWS8kSRu6pZFbKOdoRx9fHnY4IiFLhl0-p5140P-vDEuIfwrBfokECRKBEIZnuF6OiZ2ZTPlC3K0ZwNrYO6rdtNMp7Y_P_PH9I1wSLg4FUFvU1gAyLF8',
      title: 'Reabilitação de Joelho',
      completed: 6,
      total: 10,
      startDate: '12/06/2024',
      status: 'active'
    },
    {
      id: '2',
      patientName: 'Carlos Souza',
      patientImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmlWC_9HNBhHIm6fRNXXxn-WfcXx_K1luG8MuJBqpbGpyR4XQOwg03EbzI91Q2jpzS-vWtTpjIYAuILFOHi-F72Jgk2Np1-rVs2m3PXfnazUlchaXqRz6evP2C_W1I8q1ekkU6CKxwrdGXbgaEicuksOZcLp3TjA7-S9b25msyo_YARi_hCusBf_0AAkWRDkhnxiyv-lTnLHwFInO_qZy67IqKCLU73bQZILN2X4nw_8y1ofU7rlT962skwuwPJ8AECv4-4K8YAko',
      title: 'Pilates Solo',
      completed: 2,
      total: 8,
      startDate: '20/07/2024',
      status: 'active'
    },
    {
      id: '3',
      patientName: 'Maria Oliveira',
      initials: 'MO',
      color: 'bg-purple-200 text-purple-700',
      title: 'Drenagem Linfática',
      completed: 10,
      total: 10,
      startDate: '01/05/2024',
      status: 'completed'
    }
  ];

  const filteredSessions = sessions.filter(s =>
    filter === 'active' ? s.status === 'active' : s.status === 'completed'
  );

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
          onClick={() => setFilter('active')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            filter === 'active'
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
              : 'text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark'
          }`}
        >
          Em Andamento
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            filter === 'completed'
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
              : 'text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark'
          }`}
        >
          Concluídos
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSessions.map((session) => {
          const progressPercentage = (session.completed / session.total) * 100;
          return (
            <div key={session.id} className="flex flex-col md:flex-row items-center gap-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-sm hover:border-primary/30 transition-colors">
              {/* Patient Info */}
              <div className="flex items-center gap-4 w-full md:w-auto md:min-w-64">
                {session.patientImage ? (
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" style={{ backgroundImage: `url("${session.patientImage}")` }}></div>
                ) : (
                  <div className={`flex items-center justify-center font-bold rounded-full size-12 ${session.color}`}>
                    {session.initials}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-text-light dark:text-text-dark">{session.patientName}</h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Início: {session.startDate}</p>
                </div>
              </div>

              {/* Session Info */}
              <div className="flex-1 w-full">
                 <div className="flex justify-between mb-2">
                    <span className="font-medium text-text-light dark:text-text-dark">{session.title}</span>
                    <span className="text-sm font-bold text-primary">{session.completed} / {session.total} Sessões</span>
                 </div>
                 <div className="h-2.5 w-full rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                 </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button className="flex items-center justify-center size-10 rounded-lg hover:bg-primary/10 text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors">
                  <Icon name="edit" />
                </button>
                <button className="flex items-center justify-center h-10 px-4 rounded-lg bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors">
                  Detalhes
                </button>
              </div>
            </div>
          );
        })}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12 text-subtle-light dark:text-subtle-dark">
            <Icon name="check_circle" className="text-4xl mb-2 opacity-50" />
            <p>Nenhuma sessão encontrada nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
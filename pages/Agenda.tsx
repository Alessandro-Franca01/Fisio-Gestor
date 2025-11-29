
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

// Mock data for appointments
const appointments = [
  { id: 1, dayIndex: 0, time: '09:00', patient: 'Ana Silva', type: 'Fisioterapia', color: 'bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300' },
  { id: 2, dayIndex: 0, time: '14:00', patient: 'Carlos Souza', type: 'Pilates', color: 'bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500 text-green-700 dark:text-green-300' },
  { id: 3, dayIndex: 1, time: '10:00', patient: 'Maria Oliveira', type: 'Avaliação', color: 'bg-purple-100 dark:bg-purple-900/40 border-l-4 border-purple-500 text-purple-700 dark:text-purple-300' },
  { id: 4, dayIndex: 2, time: '16:00', patient: 'João Santos', type: 'Reabilitação', color: 'bg-orange-100 dark:bg-orange-900/40 border-l-4 border-orange-500 text-orange-700 dark:text-orange-300' },
  { id: 5, dayIndex: 3, time: '11:00', patient: 'Fernanda Lima', type: 'Fisioterapia', color: 'bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300' },
  { id: 6, dayIndex: 4, time: '09:00', patient: 'Roberto Dias', type: 'Pilates', color: 'bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500 text-green-700 dark:text-green-300' },
  { id: 7, dayIndex: 4, time: '15:00', patient: 'Lucia Almeida', type: 'Avaliação', color: 'bg-purple-100 dark:bg-purple-900/40 border-l-4 border-purple-500 text-purple-700 dark:text-purple-300' },
];

const weekDays = [
  { label: 'Seg', date: '12', fullDate: '2024-08-12' },
  { label: 'Ter', date: '13', fullDate: '2024-08-13' },
  { label: 'Qua', date: '14', fullDate: '2024-08-14' },
  { label: 'Qui', date: '15', fullDate: '2024-08-15' },
  { label: 'Sex', date: '16', fullDate: '2024-08-16' },
  { label: 'Sáb', date: '17', fullDate: '2024-08-17' },
  { label: 'Dom', date: '18', fullDate: '2024-08-18' },
];

const hours = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const Agenda: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'Semana' | 'Mês'>('Semana');

  const getAppointment = (dayIndex: number, time: string) => {
    return appointments.find(app => app.dayIndex === dayIndex && app.time === time);
  };

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Gerencie seus horários e atendimentos.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-light dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
            <button 
              onClick={() => setCurrentView('Semana')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${currentView === 'Semana' ? 'bg-primary/20 text-primary' : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setCurrentView('Mês')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${currentView === 'Mês' ? 'bg-primary/20 text-primary' : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'}`}
            >
              Mês
            </button>
          </div>
          <button onClick={() => navigate('/appointments/new')} className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide shadow-sm hover:opacity-90">
            <Icon name="add" />
            <span className="truncate hidden sm:inline">Novo Agendamento</span>
          </button>
        </div>
      </header>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-4 shrink-0 bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-primary/10 rounded-full text-text-light dark:text-text-dark">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="text-lg font-bold text-text-light dark:text-text-dark">Agosto 2024</span>
          <button className="p-1 hover:bg-primary/10 rounded-full text-text-light dark:text-text-dark">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          Hoje
        </button>
      </div>

      {/* Week View Grid */}
      <div className="flex-1 overflow-auto bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-border-light dark:border-border-dark sticky top-0 bg-surface-light dark:bg-surface-dark z-10">
            <div className="p-4 border-r border-border-light dark:border-border-dark flex items-center justify-center text-subtle-light dark:text-subtle-dark font-medium text-sm">
              Horário
            </div>
            {weekDays.map((day, index) => (
              <div key={index} className={`p-3 text-center border-r border-border-light dark:border-border-dark last:border-r-0 ${index === 0 ? 'bg-primary/5' : ''}`}>
                <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark">{day.label}</p>
                <p className={`text-lg font-bold ${index === 0 ? 'text-primary' : 'text-text-light dark:text-text-dark'}`}>{day.date}</p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 min-h-[100px]">
                {/* Time Label */}
                <div className="p-2 border-r border-border-light dark:border-border-dark flex items-start justify-center text-xs font-medium text-subtle-light dark:text-subtle-dark bg-background-light/50 dark:bg-background-dark/50">
                  {hour}
                </div>

                {/* Days Cells */}
                {weekDays.map((day, dayIndex) => {
                  const appointment = getAppointment(dayIndex, hour);
                  
                  return (
                    <div key={`${dayIndex}-${hour}`} className="relative border-r border-border-light dark:border-border-dark last:border-r-0 p-1 group hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                      {appointment ? (
                        <div 
                          className={`w-full h-full rounded-md p-2 text-xs flex flex-col gap-1 cursor-pointer hover:opacity-90 transition-opacity shadow-sm ${appointment.color}`}
                          onClick={() => navigate('/appointments/execute')}
                        >
                          <div className="font-bold truncate">{appointment.patient}</div>
                          <div className="truncate opacity-80">{appointment.type}</div>
                        </div>
                      ) : (
                         <div className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                            <button 
                                onClick={() => navigate('/appointments/new')}
                                className="p-1 rounded-full bg-primary/20 hover:bg-primary/40 text-primary transition-colors"
                                title="Adicionar agendamento"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                         </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

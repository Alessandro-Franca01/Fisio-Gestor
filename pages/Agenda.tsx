
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { AppointmentCategory } from '../types';

// Mock data atualizado com categorias
const appointments = [
  { id: 1, dayIndex: 0, time: '09:00', patient: 'Ana Silva', type: 'Privado', category: AppointmentCategory.PRIVATE, color: 'bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300' },
  { id: 2, dayIndex: 0, time: '14:00', patient: 'Carlos Souza', type: 'Pilates', category: AppointmentCategory.CLINIC, slot: 0, color: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-300' },
  { id: 22, dayIndex: 0, time: '14:00', patient: 'Joana Lima', type: 'Pilates', category: AppointmentCategory.CLINIC, slot: 1, color: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-300' },
  { id: 3, dayIndex: 1, time: '10:00', patient: 'Maria Oliveira', type: 'Avaliação', category: AppointmentCategory.PRIVATE, color: 'bg-purple-100 dark:bg-purple-900/40 border-l-4 border-purple-500 text-purple-700 dark:text-purple-300' },
  { id: 4, dayIndex: 2, time: '16:00', patient: 'João Santos', type: 'Clínica', category: AppointmentCategory.CLINIC, slot: 0, color: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-300' },
];

const weekDays = [
  { label: 'Seg', date: '12' },
  { label: 'Ter', date: '13' },
  { label: 'Qua', date: '14' },
  { label: 'Qui', date: '15' },
  { label: 'Sex', date: '16' },
  { label: 'Sáb', date: '17' },
  { label: 'Dom', date: '18' },
];

const hours = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const Agenda: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'Semana' | 'Mês'>('Semana');

  const getAppointmentsForCell = (dayIndex: number, time: string) => {
    return appointments.filter(app => app.dayIndex === dayIndex && app.time === time);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Seus atendimentos particulares e em clínica.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-light dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
            <button 
              onClick={() => setCurrentView('Semana')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${currentView === 'Semana' ? 'bg-primary text-background-dark shadow-sm' : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setCurrentView('Mês')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${currentView === 'Mês' ? 'bg-primary text-background-dark shadow-sm' : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'}`}
            >
              Mês
            </button>
          </div>
          <button onClick={() => navigate('/appointments/new')} className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold shadow-sm hover:opacity-90">
            <Icon name="add" />
            <span className="truncate hidden sm:inline">Novo Atendimento</span>
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col overflow-hidden bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm min-h-0">
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-primary/10 rounded-full text-text-light dark:text-text-dark transition-colors">
              <Icon name="chevron_right" className="rotate-180" />
            </button>
            <span className="text-lg font-bold text-text-light dark:text-text-dark">Agosto 2024</span>
            <button className="p-1 hover:bg-primary/10 rounded-full text-text-light dark:text-text-dark transition-colors">
              <Icon name="chevron_right" />
            </button>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-subtle-light dark:text-subtle-dark font-medium">Privado</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-subtle-light dark:text-subtle-dark font-medium">Clínica</span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="min-w-[1000px]">
            {/* Header */}
            <div className="grid grid-cols-8 sticky top-0 bg-surface-light dark:bg-surface-dark z-20 shadow-sm border-b border-border-light dark:border-border-dark">
              <div className="p-4 border-r border-border-light dark:border-border-dark flex items-center justify-center text-subtle-light dark:text-subtle-dark font-medium text-xs uppercase tracking-wider">
                Horário
              </div>
              {weekDays.map((day, idx) => (
                <div key={idx} className={`p-3 text-center border-r border-border-light dark:border-border-dark last:border-r-0 ${idx === 0 ? 'bg-primary/5' : ''}`}>
                  <p className="text-xs font-semibold text-subtle-light dark:text-subtle-dark uppercase">{day.label}</p>
                  <p className={`text-xl font-black ${idx === 0 ? 'text-primary' : 'text-text-light dark:text-text-dark'}`}>{day.date}</p>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="bg-background-light/20 dark:bg-background-dark/20">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 min-h-[140px] border-b border-border-light dark:border-border-dark last:border-b-0">
                  <div className="p-2 border-r border-border-light dark:border-border-dark flex items-start justify-center text-xs font-bold text-subtle-light dark:text-subtle-dark">
                    {hour}
                  </div>
                  {weekDays.map((_, dayIdx) => {
                    const apps = getAppointmentsForCell(dayIdx, hour);
                    const hasClinic = apps.some(a => a.category === AppointmentCategory.CLINIC);

                    return (
                      <div key={`${dayIdx}-${hour}`} className="relative border-r border-border-light dark:border-border-dark last:border-r-0 p-1 group">
                        {apps.length > 0 ? (
                          <div className={`h-full w-full ${hasClinic ? 'grid grid-cols-2 grid-rows-2 gap-1' : 'flex flex-col'}`}>
                            {apps.map((app) => (
                              <div 
                                key={app.id} 
                                onClick={() => navigate('/appointments/execute')}
                                className={`rounded-lg p-2 text-[10px] leading-tight cursor-pointer shadow-sm border transition-all hover:scale-[1.02] flex flex-col justify-between ${app.color} ${app.category === AppointmentCategory.PRIVATE ? 'h-full flex-1' : ''}`}
                              >
                                <div>
                                   <div className="font-bold truncate">{app.patient}</div>
                                   <div className="opacity-70 truncate">{app.type}</div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <Icon name={app.category === AppointmentCategory.CLINIC ? 'domain' : 'person'} className="text-[12px]" />
                                    {app.category === AppointmentCategory.CLINIC && <span className="font-black">#{app.slot! + 1}</span>}
                                </div>
                              </div>
                            ))}
                            {/* Empty Clinic Slots */}
                            {hasClinic && apps.length < 4 && Array.from({ length: 4 - apps.length }).map((_, i) => (
                              <div key={`empty-${i}`} className="border border-dashed border-border-light dark:border-border-dark rounded-lg bg-background-light/30 dark:bg-background-dark/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => navigate('/appointments/new')} className="text-subtle-light dark:text-subtle-dark"><Icon name="add" className="text-xs" /></button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button 
                              onClick={() => navigate('/appointments/new')}
                              className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/40 transition-colors"
                            >
                              <Icon name="add" className="text-sm" />
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
    </div>
  );
};

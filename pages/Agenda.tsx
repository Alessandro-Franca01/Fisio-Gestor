
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { AppointmentCategory } from '../types';

// Mock data atualizado com datas reais para suportar visão mensal
const appointmentsMock = [
  { id: 1, date: '2024-08-12', time: '09:00', patient: 'Ana Silva', type: 'Privado', category: AppointmentCategory.PRIVATE, color: 'bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300' },
  { id: 2, date: '2024-08-12', time: '14:00', patient: 'Carlos Souza', type: 'Pilates', category: AppointmentCategory.CLINIC, slot: 0, color: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-300' },
  { id: 22, date: '2024-08-12', time: '14:00', patient: 'Joana Lima', type: 'Pilates', category: AppointmentCategory.CLINIC, slot: 1, color: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-300' },
  { id: 3, date: '2024-08-13', time: '10:00', patient: 'Maria Oliveira', type: 'Avaliação', category: AppointmentCategory.PRIVATE, color: 'bg-purple-100 dark:bg-purple-900/40 border-l-4 border-purple-500 text-purple-700 dark:text-purple-300' },
  { id: 4, date: '2024-08-14', time: '16:00', patient: 'João Santos', type: 'Clínica', category: AppointmentCategory.CLINIC, slot: 0, color: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-300' },
  { id: 5, date: '2024-08-20', time: '08:00', patient: 'Ricardo Melo', type: 'Privado', category: AppointmentCategory.PRIVATE, color: 'bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300' },
];

const weekDayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const hours = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const Agenda: React.FC = () => {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState(new Date(2024, 7, 12)); // Agosto de 2024
  const [currentView, setCurrentView] = useState<'Semana' | 'Mês'>('Semana');

  // Helpers de data
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const currentWeekDays = useMemo(() => {
    const startOfWeek = new Date(viewDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para Segunda
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [viewDate]);

  const currentMonthDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // Padding inicial (dias do mês anterior para completar a primeira semana)
    let startPadding = firstDay.getDay();
    startPadding = startPadding === 0 ? 6 : startPadding - 1; // Ajusta para Segunda
    for (let i = startPadding; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({ date: d, currentMonth: false });
    }

    // Dias do mês atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, currentMonth: true });
    }

    // Padding final (dias do mês seguinte)
    const remaining = 42 - days.length; // Garante 6 linhas sempre para layout fixo
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, currentMonth: false });
    }

    return days;
  }, [viewDate]);

  const changeDate = (amount: number) => {
    const newDate = new Date(viewDate);
    if (currentView === 'Semana') {
      newDate.setDate(viewDate.getDate() + amount * 7);
    } else {
      newDate.setMonth(viewDate.getMonth() + amount);
    }
    setViewDate(newDate);
  };

  const getAppointmentsForDate = (date: Date, time?: string) => {
    const dateStr = formatDate(date);
    return appointmentsMock.filter(app => {
      const matchDate = app.date === dateStr;
      const matchTime = time ? app.time === time : true;
      return matchDate && matchTime;
    });
  };

  const renderWeeklyView = () => (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[1000px]">
        {/* Header da Grade Semanal */}
        <div className="grid grid-cols-8 sticky top-0 bg-surface-light dark:bg-surface-dark z-20 shadow-sm border-b border-border-light dark:border-border-dark">
          <div className="p-4 border-r border-border-light dark:border-border-dark flex items-center justify-center text-subtle-light dark:text-subtle-dark font-medium text-xs uppercase tracking-wider">
            Horário
          </div>
          {currentWeekDays.map((day, idx) => (
            <div key={idx} className={`p-3 text-center border-r border-border-light dark:border-border-dark last:border-r-0 ${day.toDateString() === new Date().toDateString() ? 'bg-primary/5' : ''}`}>
              <p className="text-xs font-semibold text-subtle-light dark:text-subtle-dark uppercase">{weekDayNames[idx]}</p>
              <p className={`text-xl font-black ${day.toDateString() === new Date().toDateString() ? 'text-primary' : 'text-text-light dark:text-text-dark'}`}>{day.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Conteúdo da Grade Semanal */}
        <div className="bg-background-light/20 dark:bg-background-dark/20">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 min-h-[140px] border-b border-border-light dark:border-border-dark last:border-b-0">
              <div className="p-2 border-r border-border-light dark:border-border-dark flex items-start justify-center text-xs font-bold text-subtle-light dark:text-subtle-dark">
                {hour}
              </div>
              {currentWeekDays.map((day, dayIdx) => {
                const apps = getAppointmentsForDate(day, hour);
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
  );

  const renderMonthlyView = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header dos dias da semana */}
      <div className="grid grid-cols-7 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark shadow-sm">
        {weekDayNames.map(day => (
          <div key={day} className="p-3 text-center text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase tracking-wider border-r border-border-light dark:border-border-dark last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Grade Mensal */}
      <div className="flex-1 grid grid-cols-7 overflow-auto bg-background-light/20 dark:bg-background-dark/20">
        {currentMonthDays.map((dayObj, idx) => {
          const apps = getAppointmentsForDate(dayObj.date);
          const isToday = dayObj.date.toDateString() === new Date().toDateString();

          return (
            <div
              key={idx}
              className={`min-h-[120px] p-2 border-r border-b border-border-light dark:border-border-dark group transition-colors flex flex-col gap-1
                ${!dayObj.currentMonth ? 'bg-background-light/50 dark:bg-background-dark/50' : 'bg-surface-light dark:bg-surface-dark'}
                ${idx % 7 === 6 ? 'border-r-0' : ''}
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-bold flex items-center justify-center size-7 rounded-full transition-colors
                  ${isToday ? 'bg-primary text-background-dark' : 'text-text-light dark:text-text-dark'}
                  ${!dayObj.currentMonth ? 'opacity-30' : 'opacity-100'}
                `}>
                  {dayObj.date.getDate()}
                </span>
                {apps.length > 0 && (
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 rounded uppercase">
                    {apps.length} Atend.
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
                {apps.slice(0, 3).map(app => (
                  <div
                    key={app.id}
                    onClick={() => navigate('/appointments/execute')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate border border-transparent hover:border-primary/50 cursor-pointer ${app.color.split(' ')[0]} ${app.color.split(' ')[2]}`}
                  >
                    {app.time} - {app.patient}
                  </div>
                ))}
                {apps.length > 3 && (
                  <div className="text-[9px] text-subtle-light dark:text-subtle-dark font-bold pl-1">
                    + {apps.length - 3} mais...
                  </div>
                )}
              </div>

              {/* Botão flutuante para adicionar no dia */}
              <button
                onClick={() => navigate('/appointments/new')}
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 right-1 size-6 bg-primary text-background-dark rounded-full flex items-center justify-center shadow-lg transform hover:scale-110"
              >
                <Icon name="add" className="text-sm" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

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
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${currentView === 'Semana' ? 'bg-primary text-background-dark shadow-sm' : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'}`}
            >
              Semana
            </button>
            <button
              onClick={() => setCurrentView('Mês')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${currentView === 'Mês' ? 'bg-primary text-background-dark shadow-sm' : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'}`}
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

      {/* Calendar Grid Container */}
      <div className="flex-1 flex flex-col overflow-hidden bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm min-h-0 relative">
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeDate(-1)}
              className="p-1 hover:bg-primary/10 rounded-full text-text-light dark:text-text-dark transition-colors"
            >
              <Icon name="chevron_right" className="rotate-180" />
            </button>
            <span className="text-lg font-bold text-text-light dark:text-text-dark">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              onClick={() => changeDate(1)}
              className="p-1 hover:bg-primary/10 rounded-full text-text-light dark:text-text-dark transition-colors"
            >
              <Icon name="chevron_right" />
            </button>
            <button
              onClick={() => setViewDate(new Date())}
              className="ml-2 px-3 py-1 text-xs font-bold border border-border-light dark:border-border-dark rounded-full hover:bg-primary/10 transition-colors"
            >
              Hoje
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <span className="text-xs text-subtle-light dark:text-subtle-dark font-bold">Privado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs text-subtle-light dark:text-subtle-dark font-bold">Clínica</span>
            </div>
          </div>
        </div>

        {currentView === 'Semana' ? renderWeeklyView() : renderMonthlyView()}
      </div>
    </div>
  );
};

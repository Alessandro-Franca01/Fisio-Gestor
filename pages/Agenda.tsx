import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { getAppointments, Appointment } from '../services/appointmentService';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, parseISO, isToday, startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentCategory } from '../types';

const weekDayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const hours = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00'
];

export const Agenda: React.FC = () => {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'Semana' | 'Mês'>('Semana');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Helpers ---

  // Helper function to format ISO date part only (YYYY-MM-DD)
  const formatDateISO = (date: Date) => format(date, 'yyyy-MM-dd');

  // Calculate days for the Week View
  const currentWeekDays = useMemo(() => {
    // startOfWeek returns Sunday by default, we want Monday? 
    // ptBR locale makes startOfWeek return Sunday (0) or Monday (1)?
    // Default startOfWeek with ptBR starts on Sunday. 
    // But weekDayNames starts with Seg. Let's force week starts on Monday if desired, or align headers.
    // However, the provided mock uses `startOfWeek` and aligns `weekDayNames` manually. 
    // Let's stick to standard `startOfWeek(..., { locale: ptBR })` which is usually Sunday or Monday depending on token.
    // Actually, ptBR locale defines week starts on Sunday (although work week starts Monday).
    // Let's force start on Monday to match the 'Seg', 'Ter' header order.

    // Note: The previous Agenda_Monthly code manually adjusted to Monday. 
    // Let's use `weekStartsOn: 1` (Monday).
    const start = startOfWeek(viewDate, { weekStartsOn: 1 }); // Monday

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [viewDate]);

  // Calculate days for the Month View (6 rows fixed)
  const currentMonthDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // Padding for first week (align to Monday)
    let startPadding = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    // We want Monday (1) to be index 0. 
    // If Sun (0), padding is 6. If Mon (1), padding is 0.
    startPadding = startPadding === 0 ? 6 : startPadding - 1;

    for (let i = startPadding; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({ date: d, currentMonth: false });
    }

    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, currentMonth: true });
    }

    // Padding for end of grid (to make 42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, currentMonth: false });
    }

    return days;
  }, [viewDate]);


  // --- Logic ---

  // Navigation
  const changeDate = (amount: number) => {
    const newDate = new Date(viewDate);
    if (currentView === 'Semana') {
      newDate.setDate(viewDate.getDate() + amount * 7);
    } else {
      newDate.setMonth(viewDate.getMonth() + amount);
    }
    setViewDate(newDate);
  };

  const handleToday = () => {
    setViewDate(new Date());
  };


  // Fetching
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let startDate: Date;
        let endDate: Date;

        if (currentView === 'Semana') {
          startDate = startOfWeek(viewDate, { weekStartsOn: 1 });
          endDate = endOfWeek(viewDate, { weekStartsOn: 1 });
        } else {
          // For Month view, we need to cover the padded days too
          // currentMonthDays logic:
          // Start = First day of month - padding
          // End = Start + 41 days

          // Simplified: get startOfMOnth and endOfMOnth, but expand to cover full weeks
          const monthStart = startOfMonth(viewDate);
          startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

          // We need 6 weeks from startDate
          const _endDate = new Date(startDate);
          _endDate.setDate(_endDate.getDate() + 41);
          endDate = _endDate;
        }

        const data = await getAppointments(startDate, endDate);
        setAppointments(data);
      } catch (err) {
        console.error('Error loading appointments:', err);
        setError('Erro ao carregar os agendamentos. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [viewDate, currentView]);

  // Filtering for Render
  const getAppointmentsForDate = (date: Date, time?: string) => {
    const dateStr = formatDateISO(date);

    return appointments.filter(app => {
      // Normalize appointment date
      // app.date from API might be YYYY-MM-DD or ISO
      let appDate = app.date;
      if (appDate && appDate.includes('T')) {
        appDate = appDate.split('T')[0];
      }

      const matchDate = appDate === dateStr;

      // If time is provided (Weekly view), match time (HH:MM)
      let matchTime = true;
      if (time) {
        // Flatten time to HH:MM
        const appTime = app.scheduled_time ? app.scheduled_time.substring(0, 5) : '';
        matchTime = appTime === time;
      }

      return matchDate && matchTime;
    });
  };


  // --- Renderers ---

  const renderWeeklyView = () => (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[1000px]">
        {/* Header da Grade Semanal */}
        <div className="grid grid-cols-8 sticky top-0 bg-surface-light dark:bg-surface-dark z-20 shadow-sm border-b border-border-light dark:border-border-dark">
          <div className="p-4 border-r border-border-light dark:border-border-dark flex items-center justify-center text-subtle-light dark:text-subtle-dark font-medium text-xs uppercase tracking-wider">
            Horário
          </div>
          {currentWeekDays.map((day, idx) => (
            <div key={idx} className={`p-3 text-center border-r border-border-light dark:border-border-dark last:border-r-0 ${isToday(day) ? 'bg-primary/5' : ''}`}>
              <p className="text-xs font-semibold text-subtle-light dark:text-subtle-dark uppercase">{weekDayNames[idx]}</p>
              <p className={`text-xl font-black ${isToday(day) ? 'text-primary' : 'text-text-light dark:text-text-dark'}`}>{day.getDate()}</p>
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
                const hasClinic = apps.some(a => a.category === AppointmentCategory.CLINIC || a.category === 'clinic');

                return (
                  <div key={`${dayIdx}-${hour}`} className="relative border-r border-border-light dark:border-border-dark last:border-r-0 p-1 group">
                    {apps.length > 0 ? (
                      <div className={`h-full w-full ${hasClinic ? 'grid grid-cols-2 grid-rows-2 gap-1' : 'flex flex-col'}`}>
                        {apps.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => navigate(`/appointments/${app.id}`)}
                            className={`rounded-lg p-2 text-[10px] leading-tight cursor-pointer shadow-sm border transition-all hover:scale-[1.02] flex flex-col justify-between ${app.color} ${app.category === AppointmentCategory.PRIVATE || app.category === 'private' ? 'h-full flex-1' : ''}`}
                            title={`${app.time || app.scheduled_time} - ${app.patient_name}`}
                          >
                            <div>
                              <div className="font-bold truncate">{app.patient_name}</div>
                              <div className="opacity-70 truncate">{app.type}</div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <Icon name={(app.category === AppointmentCategory.CLINIC || app.category === 'clinic') ? 'domain' : 'person'} className="text-[12px]" />
                              {/* Assuming slot is calculated or we just show #1 for now if needed, currently API doesnt return slot, defaulting to just showing icon */}
                              {/* {app.category === AppointmentCategory.CLINIC && <span className="font-black">#{app.slot! + 1}</span>} */}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          onClick={() => navigate(`/appointments/new?date=${formatDateISO(day)}&time=${hour}`)}
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
          const isTodayFlag = isToday(dayObj.date);

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
                  ${isTodayFlag ? 'bg-primary text-background-dark' : 'text-text-light dark:text-text-dark'}
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
                    onClick={() => navigate(`/appointments/${app.id}`)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate border border-transparent hover:border-primary/50 cursor-pointer ${app.color ? app.color.split(' ')[0] + ' ' + (app.color.split(' ')[2] || '') : 'bg-gray-100 text-gray-800'}`}
                    title={`${app.scheduled_time ? app.scheduled_time.substring(0, 5) : ''} - ${app.patient_name}`}
                  >
                    {app.scheduled_time ? app.scheduled_time.substring(0, 5) : ''} - {app.patient_name}
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
                onClick={() => navigate(`/appointments/new?date=${formatDateISO(dayObj.date)}`)}
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
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Agenda</h1>
            <p className="text-subtle-light dark:text-subtle-dark text-sm md:text-base">
              Seus atendimentos particulares e em clínica.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">

            {/* View toggle */}
            <div className="flex bg-surface-light dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
              <button
                onClick={() => setCurrentView('Semana')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'Semana'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'
                  }`}
              >
                Semana
              </button>
              <button
                onClick={() => setCurrentView('Mês')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentView === 'Mês'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'
                  }`}
              >
                Mês
              </button>
            </div>

            {/* New appointment button */}
            <button
              onClick={() => navigate('/appointments/new')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <span className="w-4 h-4 flex items-center justify-center">+</span>
              <span>Novo agendamento</span>
            </button>
          </div>
        </div>
      </header>

      {/* Calendar Grid Container */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
        <div className="flex-1 flex flex-col overflow-hidden bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm min-h-0 relative">
          <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeDate(-1)}
                className="p-1 hover:bg-primary/10 rounded-full text-text-light dark:text-text-dark transition-colors"
              >
                <Icon name="chevron_right" className="rotate-180" />
              </button>
              <span className="text-lg font-bold text-text-light dark:text-text-dark capitalize">
                {currentView === 'Mês'
                  ? format(viewDate, 'MMMM yyyy', { locale: ptBR })
                  : `Semana de ${format(startOfWeek(viewDate, { weekStartsOn: 1 }), 'dd/MM', { locale: ptBR })}`
                }
              </span>
              <button
                onClick={() => changeDate(1)}
                className="p-1 hover:bg-primary/10 rounded-full text-text-light dark:text-text-dark transition-colors"
              >
                <Icon name="chevron_right" />
              </button>
              <button
                onClick={handleToday}
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

          {isLoading
            ? <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
            : (currentView === 'Semana' ? renderWeeklyView() : renderMonthlyView())
          }
        </div>
      </div>
    </div>
  );
};
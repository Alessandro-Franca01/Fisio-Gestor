
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { getAppointments, generateWeekDays, Appointment } from '../services/appointmentService';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, parseISO, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const hours = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const Agenda: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'Semana' | 'Mês'>('Semana');
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { locale: ptBR }));
  const [weekDays, setWeekDays] = useState(generateWeekDays(new Date()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments when the week changes
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const startDate = startOfWeek(currentWeekStart, { locale: ptBR });
        const endDate = endOfWeek(currentWeekStart, { locale: ptBR });
        
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
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    const newDate = subWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newDate);
    setWeekDays(generateWeekDays(newDate));
  };

  const handleNextWeek = () => {
    const newDate = addWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newDate);
    setWeekDays(generateWeekDays(newDate));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today, { locale: ptBR }));
    setWeekDays(generateWeekDays(today));
  };

  const getAppointment = (dayIndex: number, time: string) => {
    const day = weekDays[dayIndex];
    if (!day) return null;
    
    return appointments.find(app => {
      try {
        // Format the appointment date to match the day's fullDate (YYYY-MM-DD)
        const appointmentDate = app.date ? format(new Date(app.date), 'yyyy-MM-dd') : '';
        
        // Normalize times for comparison (remove seconds if present)
        const normalizeTime = (timeStr: string) => {
          if (!timeStr) return '';
          return timeStr.split(':').slice(0, 2).join(':'); // Keep only HH:MM
        };
        
        const appointmentTime = normalizeTime(app.scheduled_time || '');
        const slotTime = normalizeTime(time);
        
        console.log('Comparing:', {
          appointmentDate,
          dayFullDate: day.fullDate,
          appointmentTime,
          slotTime,
          matches: appointmentDate === day.fullDate && appointmentTime === slotTime
        });
        
        return appointmentDate === day.fullDate && appointmentTime === slotTime;
      } catch (error) {
        console.error('Error in getAppointment:', { error, app, day, time });
        return false;
      }
    });
  };

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden p-4">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-subtle-light dark:text-subtle-dark text-base">
            {format(currentWeekStart, 'MMMM yyyy', { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePreviousWeek}
              className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark"
              aria-label="Semana anterior"
            >
              <Icon name="chevron-left" className="w-5 h-5" />
            </button>
            <button 
              onClick={handleToday}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
            >
              Hoje
            </button>
            <button 
              onClick={handleNextWeek}
              className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark"
              aria-label="Próxima semana"
            >
              <Icon name="chevron-right" className="w-5 h-5" />
            </button>
          </div>
          <div className="flex bg-surface-light dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
            <button 
              onClick={() => setCurrentView('Semana')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                currentView === 'Semana' 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'
              }`}
            >
              Semana
            </button>
            <button 
              onClick={() => setCurrentView('Mês')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                currentView === 'Mês'
                  ? 'bg-primary/20 text-primary' 
                  : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'
              }`}
              disabled
            >
              Mês (em breve)
            </button>
          </div>
          <button 
            onClick={() => navigate('/appointments/new')} 
            className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide shadow-sm transition-all hover:opacity-90"
          >
            <Icon name="plus" className="w-4 h-4" />
            <span>Novo agendamento</span>
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 rounded-lg border border-border-light dark:border-border-dark">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Icon name="alert-circle" className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-2">
              Erro ao carregar agendamentos
            </h3>
            <p className="text-subtle-light dark:text-subtle-dark mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="min-w-max">
            {/* Days Header */}
            <div className="grid grid-cols-8 gap-px border-b border-border-light dark:border-border-dark">
              <div className="h-16 flex items-center px-4">
                <span className="text-sm font-medium text-subtle-light dark:text-subtle-dark">Horário</span>
              </div>
              {weekDays.map((day, index) => {
                const dayIsToday = isToday(parseISO(day.fullDate));
                return (
                  <div key={index} className="h-16 flex flex-col items-center justify-center border-r border-border-light dark:border-border-dark last:border-r-0">
                    <span className="text-sm font-medium text-text-light dark:text-text-dark">
                      {day.label}
                    </span>
                    <span 
                      className={`flex items-center justify-center w-8 h-8 mt-1 rounded-full text-sm ${
                        dayIsToday 
                          ? 'bg-primary text-white' 
                          : 'text-subtle-light dark:text-subtle-dark'
                      }`}
                    >
                      {day.date}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-8">
              {/* Time column */}
              <div className="flex flex-col">
                {hours.map((hour) => (
                  <div 
                    key={hour} 
                    className="h-16 flex items-center px-4 border-b border-border-light dark:border-border-dark"
                  >
                    <span className="text-xs text-subtle-light dark:text-subtle-dark">
                      {hour}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className="flex flex-col border-r border-border-light dark:border-border-dark last:border-r-0"
                >
                  {hours.map((hour) => {
                    const appointment = getAppointment(dayIndex, hour);
                    return (
                      <div 
                        key={hour} 
                        className="h-16 p-1 border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors cursor-pointer"
                        onClick={() => {
                          if (appointment) {
                            navigate(`/appointments/${appointment.id}`);
                          } else {
                            navigate(`/appointments/new?date=${day.fullDate}&time=${hour}`);
                          }
                        }}
                      >
                        {appointment && (
                          <div 
                            className={`p-2 rounded text-xs h-full overflow-hidden ${appointment.color} flex flex-col`}
                          >
                            <div className="font-medium truncate">
                              {appointment.patient_name}
                            </div>
                            <div className="text-xs opacity-80 truncate">
                              {appointment.type}
                            </div>
                            {appointment.status === 'Confirmado' && (
                              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"></div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

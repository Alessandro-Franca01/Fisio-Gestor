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
        if (!app.date || !app.scheduled_time) return false;
        
        // Converter data do banco para YYYY-MM-DD
        let appointmentDateStr;
        if (typeof app.date === 'string') {
          // Se já estiver no formato YYYY-MM-DD
          if (app.date.includes('-')) {
            appointmentDateStr = app.date.split('T')[0]; // Remove parte do tempo se houver
          } 
          // Se estiver em outro formato (DD/MM/YYYY)
          else if (app.date.includes('/')) {
            const [day, month, year] = app.date.split('/');
            appointmentDateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        } else if (app.date instanceof Date) {
          // Se for um objeto Date
          appointmentDateStr = format(app.date, 'yyyy-MM-dd');
        }
        
        // Normalizar horário (remover segundos)
        const normalizeTime = (timeStr: string) => {
          if (!timeStr) return '';
          return timeStr.toString().split(':').slice(0, 2).join(':');
        };
        
        const appointmentTime = normalizeTime(app.scheduled_time);
        const slotTime = normalizeTime(time);
        
        console.log('Comparing:', {
          appointmentDate: appointmentDateStr,
          dayFullDate: day.fullDate,
          appointmentTime,
          slotTime,
          matches: appointmentDateStr === day.fullDate && appointmentTime === slotTime
        });
        
        return appointmentDateStr === day.fullDate && appointmentTime === slotTime;
        
      } catch (error) {
        console.error('Error in getAppointment:', error);
        return false;
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Agenda</h1>
            <p className="text-subtle-light dark:text-subtle-dark text-sm md:text-base">
              {format(currentWeekStart, 'MMMM yyyy', { locale: ptBR })}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Navigation controls: Removidos */}
            
            
            {/* View toggle */}
            <div className="flex bg-surface-light dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
              <button 
                onClick={() => setCurrentView('Semana')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'Semana' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark'
                }`}
              >
                Semana
              </button>
              <button 
                onClick={() => setCurrentView('Mês')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'Mês'
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark opacity-60 cursor-not-allowed'
                }`}
                disabled
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

      {/* Calendar Grid */}
      <div className="flex-1 overflow-hidden p-4 md:p-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-border-light dark:border-border-dark shadow-sm h-full overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-subtle-light dark:text-subtle-dark">Carregando agendamentos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <Icon name="alert-circle" className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                Erro ao carregar agendamentos
              </h3>
              <p className="text-subtle-light dark:text-subtle-dark mb-6 max-w-md">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              {/* Days Header - Fixed */}
              <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-border-light dark:border-border-dark">
                <div className="grid grid-cols-8 min-w-[800px]">
                  <div className="p-4">
                    <span className="text-sm font-medium text-subtle-light dark:text-subtle-dark">Horário</span>
                  </div>
                  {weekDays.map((day, index) => {
                    const dayIsToday = isToday(parseISO(day.fullDate));
                    return (
                      <div 
                        key={index} 
                        className="p-4 flex flex-col items-center justify-center border-l border-border-light dark:border-border-dark"
                      >
                        <span className="text-sm font-medium text-text-light dark:text-text-dark">
                          {day.label}
                        </span>
                        <div 
                          className={`flex items-center justify-center w-8 h-8 mt-1 rounded-full text-sm font-medium ${
                            dayIsToday 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'text-text-light dark:text-text-dark'
                          }`}
                        >
                          {day.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8">
                  {/* Time column */}
                  <div className="flex flex-col">
                    {hours.map((hour) => (
                      <div 
                        key={hour} 
                        className="h-20 flex items-center px-4 border-b border-border-light dark:border-border-dark bg-background-light/30 dark:bg-gray-800/30"
                      >
                        <span className="text-sm font-medium text-subtle-light dark:text-subtle-dark">
                          {hour}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Day columns */}
                  {weekDays.map((day, dayIndex) => (
                    <div 
                      key={dayIndex} 
                      className="flex flex-col border-l border-border-light dark:border-border-dark"
                    >
                      {hours.map((hour) => {
                        const appointment = getAppointment(dayIndex, hour);
                        return (
                          <div 
                            key={hour} 
                            className="h-20 p-2 border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-gray-800/30 transition-colors cursor-pointer group"
                            onClick={() => {
                              if (appointment) {
                                navigate(`/appointments/${appointment.id}`);
                              } else {
                                navigate(`/appointments/new?date=${day.fullDate}&time=${hour}`);
                              }
                            }}
                          >
                            {appointment ? (
                              <div 
                                className={`p-3 rounded-lg h-full overflow-hidden flex flex-col relative ${appointment.color} border-l-4 ${appointment.status === 'Confirmado' ? 'border-green-500' : 'border-amber-500'} shadow-sm hover:shadow transition-shadow`}
                              >
                                <div className="font-medium text-sm truncate mb-1">
                                  {appointment.patient_name}
                                </div>
                                <div className="text-xs opacity-80 truncate">
                                  {appointment.type}
                                </div>
                                <div className="mt-auto pt-2 flex items-center justify-between">
                                  <span className="text-xs font-medium opacity-90">
                                    {hour}
                                  </span>
                                  {/* TODO: Fix Status badge  */}
                                  {appointment?.status ? (
                                    appointment.status === 'Confirmado' || appointment.status === 'Realizado' ? (
                                      <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                                        {appointment.status}
                                      </span>
                                    ) : (
                                      <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                                        {appointment.status}
                                      </span>
                                    )
                                  ) : (
                                    <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                                      Pendente
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="h-full w-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="h-full w-full border-2 border-dashed border-border-light dark:border-border-dark rounded-lg flex items-center justify-center">
                                  <span className="text-xs text-subtle-light dark:text-subtle-dark">
                                    Clique para agendar
                                  </span>
                                </div>
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
          )}
        </div>
      </div>
    </div>
  );
};
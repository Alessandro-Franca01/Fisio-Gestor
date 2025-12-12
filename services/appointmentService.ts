import api from './api';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Appointment {
  id: number;
  patient_id: number;
  patient_name: string;
  date: string;
  scheduled_time: string;
  type: string;
  status: string;
  color: string;
}

export const getAppointments = async (startDate: Date, endDate: Date): Promise<Appointment[]> => {
  try {
    console.group('Fetching Appointments');
    console.log('Date Range:', { startDate, endDate });
    
    const response = await api.get('/appointments', {
      params: {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      },
    });
    
    console.log('Raw API Response:', response);
    
    // If response is empty or not in expected format, return empty array
    if (!response.data) {
      console.warn('Empty response data');
      return [];
    }
    
    // Try to extract appointments from different possible response structures
    let appointmentsData = [];
    
    if (Array.isArray(response.data)) {
      // Case 1: Direct array response
      appointmentsData = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Case 2: Laravel paginated response
      appointmentsData = response.data.data;
    } else if (response.data.appointments) {
      // Case 3: Wrapped in an appointments object
      appointmentsData = Array.isArray(response.data.appointments) 
        ? response.data.appointments 
        : [response.data.appointments];
    } else if (typeof response.data === 'object') {
      // Case 4: Single appointment object
      appointmentsData = [response.data];
    }
    
    console.log('Extracted appointments data:', appointmentsData);
    
    // Map to the expected format for the Agenda component
    const mappedAppointments = appointmentsData.map((appt: any) => {
      // Extract time from scheduled_time if it's a full datetime string
      let time = appt.scheduled_time || appt.time || '00:00';
      if (time.includes('T')) {
        time = time.split('T')[1].substring(0, 5); // Extract HH:MM from ISO string
      }
      
      // Format date if needed
      let date = appt.date || appt.scheduled_date;
      if (date && date.includes('T')) {
        date = date.split('T')[0]; // Keep only YYYY-MM-DD
      }
      
      return {
        id: appt.id,
        patient_id: appt.patient_id,
        patient_name: appt.patient?.name || appt.patient_name || 'Paciente não encontrado',
        date: date,
        scheduled_time: time,
        type: appt.type || 'Consulta',
        status: appt.status || 'Agendado',
        color: getAppointmentColor(appt.type || 'Consulta')
      };
    });
    
    console.log('Mapped Appointments:', mappedAppointments);
    return mappedAppointments;
    
  } catch (error) {
    console.error('Error in getAppointments:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return []; // Return empty array on error to prevent breaking the UI
  } finally {
    console.groupEnd();
  }
};
const getAppointmentColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'Fisioterapia': 'bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300',
    'Pilates': 'bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500 text-green-700 dark:text-green-300',
    'Avaliação': 'bg-purple-100 dark:bg-purple-900/40 border-l-4 border-purple-500 text-purple-700 dark:text-purple-300',
    'Reabilitação': 'bg-orange-100 dark:bg-orange-900/40 border-l-4 border-orange-500 text-orange-700 dark:text-orange-300',
  };
  
  return colors[type] || 'bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-400 text-gray-700 dark:text-gray-300';
};

export const generateWeekDays = (startDate: Date) => {
  const start = startOfWeek(startDate, { locale: ptBR });
  const end = endOfWeek(startDate, { locale: ptBR });
  
  return eachDayOfInterval({ start, end }).map((date, index) => ({
    label: format(date, 'EEE', { locale: ptBR }),
    date: format(date, 'dd'),
    fullDate: format(date, 'yyyy-MM-dd'),
    dayIndex: index
  }));
};

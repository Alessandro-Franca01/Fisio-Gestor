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
  category: 'private' | 'clinic';
  room?: string;
  slot?: number; // For visualization
}

export const getAppointments = async (startDate: Date, endDate: Date): Promise<Appointment[]> => {
  try {

    const response = await api.get('/appointments', {
      params: {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      },
    });


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
        type: appt.type || 'Fisioterapia',
        status: appt.status || 'Pendente',
        color: getAppointmentColor(appt.category),
        category: (appt.category as 'private' | 'clinic') || 'private',
        room: appt.room,
        slot: 0,
      };
    });

    return mappedAppointments;

  } catch (error) {
    console.error('Error in getAppointments:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return []; // Return empty array on error to prevent breaking the UI
  } finally {
  }
};
// A cor identifica a categoria (privado x clínica), não o tipo do atendimento.
// Evita verde, que é a cor de sucesso/concluído no restante do sistema.
const getAppointmentColor = (category?: string): string => {
  if (category === 'clinic') {
    return 'bg-violet-100 dark:bg-violet-900/40 border-l-4 border-violet-500 text-violet-700 dark:text-violet-300';
  }
  return 'bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300';
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

export const createAppointment = async (payload: {
  patient_id: number;
  session_id?: number | null;
  date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:mm
  type: string;
  status?: string;
  observations?: string | null;
}) => {
  try {
    const response = await api.post('/appointments', payload);
    // Laravel usually returns the created resource in response.data (or response.data.data)
    return response.data?.data ?? response.data;
  } catch (error) {
    // Re-throw error so caller can handle (422, 401, etc)
    throw error;
  }
};

export const getAppointmentById = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/appointments/${id}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error fetching appointment by id:', error);
    throw error;
  }
};

export const updateAppointment = async (id: string | number, payload: any) => {
  try {
    const response = await api.put(`/appointments/${id}`, payload);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (
  id: string,
  status: 'Confirmado' | 'Cancelado' | 'Pendente' | 'Faltou'
): Promise<any> => {
  try {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    await api.delete(`/appointments/${id}`);
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

export const executeAppointment = async (id: string, payload: {
  start_time: any;
  end_time: any;
  session_notes?: string | null;
  status: 'Realizado';
  resources?: string[];
}) => {
  try {
    const response = await api.post(`/appointments/${id}/execute`, payload);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error executing appointment:', error);
    throw error;
  }
};

export const getAppointmentsByPatient = async (patientId: number | string, params?: any): Promise<Appointment[]> => {
  try {
    const response = await api.get('/appointments', {
      params: {
        patient_id: patientId,
        ...params
      }
    });

    let appointmentsData = [];
    if (response.data && response.data.data) {
      appointmentsData = response.data.data;
    } else if (Array.isArray(response.data)) {
      appointmentsData = response.data;
    }

    return appointmentsData.map((appt: any) => ({
      id: appt.id,
      patient_id: appt.patient_id,
      patient_name: appt.patient?.name || '',
      date: appt.date,
      scheduled_time: appt.scheduled_time,
      type: appt.type,
      status: appt.status,
      color: getAppointmentColor(appt.category),
      category: (appt.category as 'private' | 'clinic') || 'private'
    }));
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    return [];
  }
};

export const getAppointmentBySessionNullAndPatientId = async (patientId: string, status: string): Promise<any> => {
  try {
    const response = await api.get(`/appointments?patient_id=${patientId}&session_id=null&status=${status}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error fetching appointment by session null and patient id:', error);
    throw error;
  }
};

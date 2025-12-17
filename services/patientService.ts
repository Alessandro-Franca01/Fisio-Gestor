import api from './api';

export interface Patient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birth_date?: string;
  age?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status?: string;
  notes?: string;
  addresses?: any[];
}

export const getPatients = async (params?: any): Promise<any> => {
  try {
    const response = await api.get('/patients', { params });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const getPatientById = async (id: string | number): Promise<Patient> => {
  try {
    const response = await api.get(`/patients/${id}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error fetching patient by id:', error);
    throw error;
  }
};

export const createPatient = async (payload: Partial<Patient> & { addresses?: any[] }) => {
  try {
    const response = await api.post('/patients', payload);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

export const updatePatient = async (id: string | number, payload: Partial<Patient>) => {
  try {
    const response = await api.put(`/patients/${id}`, payload);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

export const deletePatient = async (id: string | number) => {
  try {
    await api.delete(`/patients/${id}`);
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

export default {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};

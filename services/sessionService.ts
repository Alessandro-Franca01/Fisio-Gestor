import api from './api';
import { Patient } from './patientService';

export interface SessionSchedule {
    id?: number;
    day_of_week: string;
    time: string;
}

export interface Session {
    id: number;
    user_id: number;
    patient_id: number;
    title: string | null;
    total_appointments: number;
    total_value: number;
    start_date: string;
    end_date: string | null;
    status: 'Ativa' | 'Concluída' | 'Cancelada';
    observations: string | null;
    created_at: string;
    updated_at: string;
    patient?: Patient;
    schedules?: SessionSchedule[];
    appointments?: any[];
    payments?: any[];
    completed_appointments_count?: number;
}

export const getSessions = async (params?: any): Promise<any> => {
    try {
        const response = await api.get('/sessions', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw error;
    }
};

export const getSessionById = async (id: string | number): Promise<Session> => {
    try {
        const response = await api.get(`/sessions/${id}`);
        return response.data?.data ?? response.data;
    } catch (error) {
        console.error('Error fetching session by id:', error);
        throw error;
    }
};

export const createSession = async (payload: any) => {
    try {
        const response = await api.post('/sessions', payload);
        return response.data?.data ?? response.data;
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
};

export const updateSession = async (id: string | number, payload: Partial<Session>) => {
    try {
        const response = await api.put(`/sessions/${id}`, payload);
        return response.data?.data ?? response.data;
    } catch (error) {
        console.error('Error updating session:', error);
        throw error;
    }
};

export const deleteSession = async (id: string | number) => {
    try {
        await api.delete(`/sessions/${id}`);
    } catch (error) {
        console.error('Error deleting session:', error);
        throw error;
    }
};

export default {
    getSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
};

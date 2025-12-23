import api from './api';

export interface Payment {
    id: number;
    patient_id: number;
    user_id: number;
    appointment_id?: number | null;
    session_id?: number | null;
    amount: number | string;
    payment_date: string;
    payment_method: 'Pix' | 'Dinheiro' | 'Cartao' | 'Debito' | 'Gratuito';
    status: 'Pago' | 'Pendente' | 'Atrasado' | 'Cancelado' | 'Acao_Social';
    due_date?: string | null;
    notes?: string | null;
    patient?: {
        id: number;
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}

export const getPayments = async (params?: any): Promise<any> => {
    try {
        const response = await api.get('/payments', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
    }
};

export const getPaymentById = async (id: string | number): Promise<Payment> => {
    try {
        const response = await api.get(`/payments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment by id:', error);
        throw error;
    }
};

export const createPayment = async (payload: Partial<Payment>) => {
    try {
        const response = await api.post('/payments', payload);
        return response.data;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

export const updatePayment = async (id: string | number, payload: Partial<Payment>) => {
    try {
        const response = await api.put(`/payments/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating payment:', error);
        throw error;
    }
};

export const deletePayment = async (id: string | number) => {
    try {
        await api.delete(`/payments/${id}`);
    } catch (error) {
        console.error('Error deleting payment:', error);
        throw error;
    }
};

export default {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
};

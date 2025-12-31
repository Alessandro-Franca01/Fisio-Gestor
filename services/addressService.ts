import api from './api';

export interface Address {
    id?: number;
    patient_id?: number;
    type: 'Residencial' | 'Trabalho' | 'Outro';
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    is_primary?: boolean;
}

export const createAddress = async (patientId: number | string, data: Address) => {
    try {
        const response = await api.post(`/patients/${patientId}/addresses`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating address:', error);
        throw error;
    }
};

export const updateAddress = async (addressId: number | string, data: Partial<Address>) => {
    try {
        const response = await api.put(`/addresses/${addressId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};

export const deleteAddress = async (addressId: number | string) => {
    try {
        const response = await api.delete(`/addresses/${addressId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting address:', error);
        throw error;
    }
};

export default {
    createAddress,
    updateAddress,
    deleteAddress,
};

import api from './api';

export interface HealthPlan {
    id: number;
    name: string;
    value: number;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export const getHealthPlans = async (): Promise<HealthPlan[]> => {
    const response = await api.get('/health-plans');
    return response.data;
};

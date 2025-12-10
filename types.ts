export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Em dia' | 'Pendente' | 'Atrasado';
  cpf?: string;
  age?: number;
  type?: 'Ativo' | 'Inativo';
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'Pendente' | 'Realizado' | 'Cancelado' | 'Atrasado';
  location?: string;
  type?: string;
}

export interface Session {
  id: string;
  title: string;
  status: 'Pago' | 'Pendente' | 'Parcial';
  startDate: string;
  completed: number;
  total: number;
}

export interface FinancialRecord {
  id: string;
  date: string;
  patientName: string;
  value: number;
  method: 'Pix' | 'Dinheiro' | 'Cartão' | 'Transferência';
  status: 'Pago' | 'Pendente';
}

export type IconName =
  | 'dashboard'
  | 'group'
  | 'calendar_month'
  | 'payments'
  | 'settings'
  | 'logout'
  | 'search'
  | 'add'
  | 'edit'
  | 'delete'
  | 'check_circle'
  | 'event'
  | 'chevron_right'
  | 'person_search'
  | 'add_circle'
  | 'upload_file'
  | 'login'
  | 'visibility'
  | 'exercise'
  | 'bar_chart'
  | 'wallet'
  | 'person_add'
  | 'error'
  | 'hourglass_top';

export interface DashboardData {
  financial: {
    total_to_receive: number;
    monthly_revenue: number;
  };
  upcoming_appointments: any[]; // We will map this to Appointment in the component
  pending_appointments: any[];
}

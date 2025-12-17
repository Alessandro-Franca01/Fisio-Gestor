// Enums para padronização de dados
export enum UserRole {
  ADMIN = 'ADMIN',
  PHYSIOTHERAPIST = 'PHYSIOTHERAPIST',
  SECRETARY = 'SECRETARY'
}

export enum PatientStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
  ARCHIVED = 'Arquivado'
}

export enum FinancialStatus {
  PAID = 'Pago',
  PENDING = 'Pendente',
  OVERDUE = 'Atrasado',
  CANCELED = 'Cancelado'
}

export enum AppointmentStatus {
  SCHEDULED = 'Agendado',
  CONFIRMED = 'Confirmado',
  COMPLETED = 'Realizado',
  CANCELED = 'Cancelado',
  NO_SHOW = 'Não Compareceu'
}

export enum PaymentMethod {
  PIX = 'Pix',
  CASH = 'Dinheiro',
  CREDIT_CARD = 'Cartão de Crédito',
  DEBIT_CARD = 'Cartão de Débito',
  TRANSFER = 'Transferência'
}

// Interfaces Auxiliares
export interface Address {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

// Modelos Principais (Entidades do Banco de Dados)

/**
 * Representa o usuário do sistema (Fisioterapeuta ou Staff)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * Representa o Paciente
 */
export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  avatarUrl?: string;
  occupation?: string;
  
  // Endereço e Contato
  address?: Address;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Status Clínico e Financeiro
  status: PatientStatus;
  financialStatus: 'Em dia' | 'Pendente' | 'Atrasado'; // Computed field based on FinancialRecords
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Representa um Pacote de Sessões (Tratamento)
 */
export interface SessionPackage {
  id: string;
  patientId: string;
  title: string; // ex: "Tratamento Lombar - 10 Sessões"
  totalSessions: number;
  completedSessions: number;
  price: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  
  // Configuração de recorrência (ex: Seg e Qua às 14h)
  scheduleConfig?: {
    daysOfWeek: number[]; // 0-6
    fixedTime?: string;
  }[];
}

/**
 * Representa um Agendamento Individual
 */
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string; // Desnormalizado para facilitar listagem
  sessionId?: string; // Opcional, se fizer parte de um pacote
  
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  
  status: AppointmentStatus;
  type: string; // ex: "Fisioterapia", "Pilates", "Avaliação"
  location?: string;
  
  // Dados da Execução (Preenchidos após atendimento)
  clinicalNotes?: string; // Evolução
  attachments?: string[]; // URLs de fotos/exames
  
  createdAt: string;
}

/**
 * Representa um Registro Financeiro (Receita ou Despesa)
 */
export interface FinancialRecord {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  value: number;
  
  // Relacionamentos
  patientId?: string;
  patientName?: string;
  appointmentId?: string;
  sessionId?: string;

  // Detalhes do Pagamento
  dueDate: string;
  paymentDate?: string;
  method?: PaymentMethod;
  status: FinancialStatus;
  
  createdAt: string;
}

// Tipo para os ícones do sistema (Frontend UI)
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
  | 'hourglass_top'
  | 'assignment'
  | 'filter_list';
import { AppointmentCategory } from '../types';

export const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

const DAY_INDEX: Record<string, number> = {
  Domingo: 0,
  'Segunda-feira': 1,
  'Terça-feira': 2,
  'Quarta-feira': 3,
  'Quinta-feira': 4,
  'Sexta-feira': 5,
  Sábado: 6,
};

export interface ScheduleSlot {
  day_of_week: string;
  time: string;
}

const toLocalISODate = (d: Date): string => {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

interface GenerateParams {
  totalAppointments: number;
  startDate: string; // YYYY-MM-DD
  schedules: ScheduleSlot[];
  category: AppointmentCategory;
  room: string;
  healthPlanId: string;
}

/** Gera os agendamentos de uma sessão a partir dos horários fixos semanais. */
export const generateAppointments = (p: GenerateParams) => {
  if (!p.totalAppointments || isNaN(p.totalAppointments)) return [];

  const sorted = [...p.schedules].sort(
    (a, b) => DAY_INDEX[a.day_of_week] - DAY_INDEX[b.day_of_week] || a.time.localeCompare(b.time)
  );
  const healthPlanId =
    p.category === AppointmentCategory.CLINIC && p.healthPlanId ? Number(p.healthPlanId) : null;

  const appointments = [];
  const current = new Date(p.startDate + 'T00:00:00'); // horário local
  const maxIterations = 365 * 2; // trava de segurança: 2 anos

  for (let i = 0; i < maxIterations && appointments.length < p.totalAppointments; i++) {
    for (const slot of sorted) {
      if (DAY_INDEX[slot.day_of_week] === current.getDay() && appointments.length < p.totalAppointments) {
        appointments.push({
          date: toLocalISODate(current),
          time: slot.time,
          day_of_week: slot.day_of_week,
          category: p.category,
          room: p.room,
          health_plan_id: healthPlanId,
          status: 'Pendente',
        });
      }
    }
    current.setDate(current.getDate() + 1);
  }
  return appointments;
};

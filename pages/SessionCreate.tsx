import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { hours } from './Agenda';
import sessionService from '../services/sessionService';
import patientService, { Patient } from '../services/patientService';
import { getHealthPlans, HealthPlan } from '../services/healthPlanService';
import { AppointmentCategory } from '../types';

const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

export const SessionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);

  const [formData, setFormData] = useState<{
    patient_id: string;
    title: string;
    total_appointments: string;
    total_value: string;
    start_date: string;
    observations: string;
    schedules: { day_of_week: string; time: string }[];
    category: AppointmentCategory;
    room: string;
    health_plan_id: string;
  }>({
    patient_id: '',
    title: '',
    total_appointments: '',
    total_value: '',
    start_date: new Date().toISOString().split('T')[0],
    observations: '',
    schedules: [{ day_of_week: 'Segunda-feira', time: '09:00' }],
    category: AppointmentCategory.PRIVATE,
    room: '',
    health_plan_id: '',
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientService.getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch patients', error);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchHealthPlans = async () => {
      try {
        const plans = await getHealthPlans();
        setHealthPlans(plans);
      } catch (error) {
        console.error('Failed to fetch health plans', error);
      }
    };
    fetchHealthPlans();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchSession = async () => {
        try {
          const session = await sessionService.getSessionById(id);
          setFormData({
            patient_id: session.patient_id.toString(),
            title: session.title || '',
            total_appointments: session.total_appointments.toString(),
            total_value: session.total_value.toString(),
            start_date: session.start_date.split('T')[0],
            observations: session.observations || '',
            schedules: session.schedules && session.schedules.length > 0
              ? session.schedules.map(s => ({
                day_of_week: s.day_of_week,
                time: s.time.substring(0, 5) // HH:mm
              }))
              : [{ day_of_week: 'Segunda-feira', time: '09:00' }],
            category: (session as any).category || AppointmentCategory.PRIVATE,
            room: (session as any).room || '',
            health_plan_id: (session as any).health_plan_id ? String((session as any).health_plan_id) : '',
          });
        } catch (error) {
          console.error('Failed to fetch session', error);
          alert('Erro ao carregar os dados da sessão.');
          navigate('/sessions');
        }
      };
      fetchSession();
    }
  }, [isEditing, id, navigate]);

  useEffect(() => {
    if (formData.health_plan_id) {
      setFormData(prev => ({ ...prev, total_value: '0' }));
    }
  }, [formData.health_plan_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { day_of_week: 'Segunda-feira', time: '09:00' }]
    }));
  };

  const removeSchedule = (index: number) => {
    if (formData.schedules.length > 1) {
      setFormData(prev => ({
        ...prev,
        schedules: prev.schedules.filter((_, i) => i !== index)
      }));
    }
  };

  const generateAppointments = () => {
    const total = parseInt(formData.total_appointments);
    if (!total || isNaN(total)) return [];

    const appointments = [];
    let currentDate = new Date(formData.start_date + 'T00:00:00'); // Ensure local time treatment
    let count = 0;

    // Sort schedules by day of week
    const dayMap: { [key: string]: number } = {
      'Domingo': 0, 'Segunda-feira': 1, 'Terça-feira': 2,
      'Quarta-feira': 3, 'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6
    };

    const sortedSchedules = [...formData.schedules].sort((a, b) => {
      const dayDiff = dayMap[a.day_of_week] - dayMap[b.day_of_week];
      if (dayDiff !== 0) return dayDiff;
      return a.time.localeCompare(b.time);
    });

    // Safety break to prevent infinite loops
    let iterations = 0;
    const maxIterations = 365 * 2; // 2 years max

    while (count < total && iterations < maxIterations) {
      const currentDay = currentDate.getDay(); // 0 (Sun) to 6 (Sat)

      for (const schedule of sortedSchedules) {
        if (dayMap[schedule.day_of_week] === currentDay) {
          if (count < total) {
            appointments.push({
              date: currentDate.toISOString().split('T')[0],
              time: schedule.time,
              day_of_week: schedule.day_of_week,
              category: formData.category,
              room: formData.room,
              health_plan_id: formData.category === AppointmentCategory.CLINIC ? (formData.health_plan_id ? Number(formData.health_plan_id) : null) : null,
              status: 'Pendente'
            });
            count++;
          }
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      iterations++;
    }

    return appointments;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id) {
      alert('Por favor, selecione um paciente');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await sessionService.updateSession(id!, {
          ...formData,
          total_appointments: parseInt(formData.total_appointments),
          total_value: parseFloat(formData.total_value.replace(',', '.'))
        });
      } else {
        const generatedAppointments = generateAppointments();
        await sessionService.createSession({
          ...formData,
          total_appointments: parseInt(formData.total_appointments),
          total_value: parseFloat(formData.total_value.replace(',', '.')),
          appointments: generatedAppointments
        });
      }
      navigate('/sessions');
    } catch (error) {
      console.error('Failed to save session', error);
      alert('Erro ao salvar sessão. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
            {isEditing ? 'Editar Sessão' : 'Cadastro de Sessão'}
          </p>
          <button
            type="submit"
            disabled={loading}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
          >
            <span className="truncate">{loading ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>

        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 md:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">

            {/* Category Toggle */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Tipo de Atendimento</h2>
              <div className="flex p-1 bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark w-full sm:w-fit">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: AppointmentCategory.PRIVATE, health_plan_id: '' }))}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${formData.category === AppointmentCategory.PRIVATE ? 'bg-primary text-background-dark shadow-md' : 'text-subtle-light dark:text-subtle-dark hover:bg-primary/10'}`}
                >
                  <Icon name="person" />
                  Atendimento Privado
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: AppointmentCategory.CLINIC }))}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${formData.category === AppointmentCategory.CLINIC ? 'bg-primary text-background-dark shadow-md' : 'text-subtle-light dark:text-subtle-dark hover:bg-primary/10'}`}
                  disabled={isEditing}
                >
                  <Icon name="domain" />
                  Atendimento em Clínica
                </button>
              </div>
              {formData.category === AppointmentCategory.CLINIC && (
                <p className="mt-3 text-xs text-subtle-light dark:text-subtle-dark italic">
                  * Na clínica, você pode atender até 4 pacientes simultaneamente.
                </p>
              )}
            </div>

            {/* Health Plan - Visible only for Clinic */}
            {formData.category === AppointmentCategory.CLINIC && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-background-light/50 dark:bg-background-dark/50 rounded-lg border border-border-light dark:border-border-dark animate-in fade-in slide-in-from-top-2">
                <div className="md:col-span-2 flex items-center gap-2">
                  <Icon name="health_and_safety" className="text-primary" />
                  <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Plano de Saúde / Convênio</h3>
                </div>
                <div>
                  <label className="flex flex-col">
                    <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Nome do Convênio</p>
                    <select
                      name="health_plan_id"
                      value={formData.health_plan_id}
                      onChange={handleChange}
                      className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
                    >
                      <option value="">Selecione o plano</option>
                      {healthPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div>
                  <label className="flex flex-col">
                    <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Valor do Repasse (R$)</p>
                    <input
                      value={formData.health_plan_id ? healthPlans.find(p => p.id === Number(formData.health_plan_id))?.value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-subtle-light dark:text-subtle-dark border border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50 h-12 px-4 text-base font-medium cursor-not-allowed"
                      placeholder="R$ 0,00"
                      type="text"
                      readOnly
                      disabled
                    />
                  </label>
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Paciente</p>
                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                  className={`form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base ${isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
                {isEditing && <p className="text-xs text-subtle-light dark:text-subtle-dark mt-1">O paciente não pode ser alterado após a criação.</p>}
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Título do Tratamento (Opcional)</p>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
                  placeholder="Ex: Reabilitação de Joelho"
                  type="text"
                />
              </label>
            </div>

            <div>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Número de Atendimentos</p>
                <input
                  name="total_appointments"
                  value={formData.total_appointments}
                  onChange={handleChange}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
                  placeholder="Ex: 10"
                  type="number"
                  min="1"
                />
              </label>
            </div>

            <div>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Valor Total (R$)</p>
                <input
                  name="total_value"
                  value={formData.total_value}
                  onChange={handleChange}
                  required={!formData.health_plan_id}
                  disabled={!!formData.health_plan_id}
                  className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base ${formData.health_plan_id ? 'opacity-60 cursor-not-allowed bg-background-light/50 dark:bg-background-dark/50' : ''}`}
                  placeholder="0.00"
                  type="text"
                />
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Data de Início</p>
                <input
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
                  type="date"
                />
              </label>
            </div>

            {formData.category === AppointmentCategory.CLINIC && (
              <div className="md:col-span-2">
                <label className="flex flex-col">
                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Sala na Clínica</p>
                  <select
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
                  >
                    <option value="no_room">Selecione uma sala</option>
                    <option value="room1">Sala 1 (Livre)</option>
                    <option value="room2">Sala 2 (Livre)</option>
                    <option value="room3">Sala 3 (Ocupada)</option>
                    <option value="room4">Sala 4 (Livre)</option>
                  </select>
                </label>
              </div>
            )}

            <div className="md:col-span-2">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Horários Fixos da Semana</p>
              <div className="flex flex-col gap-4">
                {formData.schedules.map((slot, i) => (
                  <div key={i} className="flex items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                      <select
                        value={slot.day_of_week}
                        onChange={(e) => handleScheduleChange(i, 'day_of_week', e.target.value)}
                        className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
                      >
                        {DAYS_OF_WEEK.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col min-w-32 flex-none">
                      <select
                        value={slot.time}
                        onChange={(e) => handleScheduleChange(i, 'time', e.target.value)}
                        className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
                      >
                        {hours.map(hour => (
                          <option key={hour} value={hour}>{hour}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSchedule(i)}
                      disabled={formData.schedules.length <= 1}
                      className="flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-text-light dark:text-text-dark hover:bg-primary/10 disabled:opacity-30"
                    >
                      <Icon name="delete" className="text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSchedule}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary/20 dark:bg-primary/30 text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/30"
                >
                  <Icon name="add" />
                  <span className="truncate">Adicionar Horário</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Observações</p>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark min-h-32 px-4 py-3 text-base"
                  placeholder="Digite aqui suas observações..."
                ></textarea>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4 border-t border-border-light dark:border-border-dark pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/10"
            >
              <span className="truncate">Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 disabled:opacity-50"
            >
              <span className="truncate">{loading ? 'Salvando...' : 'Salvar Sessão'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


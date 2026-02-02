import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { hours } from './Agenda';
import { createAppointment, getAppointmentById, updateAppointment } from '../services/appointmentService';
import { getHealthPlans, HealthPlan } from '../services/healthPlanService';
import { getPatients, Patient } from '../services/patientService';
import { AppointmentCategory } from '../types';

export const AppointmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditing = !!id;

  const [patientId, setPatientId] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Fisioterapia');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<AppointmentCategory>(AppointmentCategory.PRIVATE);
  const [room, setRoom] = useState('');
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [healthPlanId, setHealthPlanId] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [status, setStatus] = useState('Pendente');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch patients', error);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (patientId) {
      const patient = patients.find(p => p.id === Number(patientId));
      setSelectedPatient(patient || null);
    } else {
      setSelectedPatient(null);
    }
  }, [patientId, patients]);

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

  // Load appointment data if editing
  useEffect(() => {
    if (isEditing) {
      const loadAppointment = async () => {
        try {
          const data = await getAppointmentById(id!);
          setPatientId(data.patient_id);
          setDate(data.date ? data.date.substring(0, 10) : '');
          setTime(data.scheduled_time ? data.scheduled_time.substring(0, 5) : '');
          setType(data.type);
          setObservations(data.observations || '');
          setCategory(data.category as AppointmentCategory || AppointmentCategory.PRIVATE);
          setRoom(data.room || '');
          setHealthPlanId(data.health_plan_id ? String(data.health_plan_id) : '');
          setStatus(data.status || 'Pendente');
        } catch (err) {
          console.error('Failed to load appointment', err);
          setError('Erro ao carregar dados do agendamento.');
        }
      };
      loadAppointment();
    }
  }, [isEditing, id]);

  useEffect(() => {
    if (!isEditing) {
      const params = new URLSearchParams(location.search);
      const qDate = params.get('date');
      const qTime = params.get('time');
      const qRoom = params.get('room');
      if (qDate) setDate(qDate);
      if (qTime) setTime(qTime);
      if (qRoom) setRoom(qRoom);
    }
  }, [location.search, isEditing]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!patientId) {
      setError('Selecione um paciente.');
      return;
    }
    if (!date || !time) {
      setError('Preencha data e hora do atendimento.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        patient_id: Number(patientId),
        date: date, // expecting YYYY-MM-DD
        scheduled_time: time, // expecting HH:MM
        type,
        observations: observations || null,
        room: room,
        category: category,
        status: status,
        health_plan_id: category === AppointmentCategory.CLINIC ? (healthPlanId ? Number(healthPlanId) : null) : null,
      } as any;

      if (isEditing) {
        await updateAppointment(id!, payload);
        navigate(`/appointments/${id}`);
      } else {
        const created = await createAppointment(payload);
        const createdId = created?.id ?? created?.data?.id;
        if (createdId) {
          navigate(`/appointments/${createdId}`);
        } else if (created && created.id) {
          navigate(`/appointments/${created.id}`);
        } else {
          navigate('/appointments');
        }
      }
    } catch (err: any) {
      if (err?.response?.status === 422) {
        const messages = err.response.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : err.response.data?.message || 'Erro de validação.';
        setError(messages);
      } else if (err?.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Erro ao salvar agendamento. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
          {isEditing ? 'Editar Atendimento' : 'Novo Atendimento'}
        </h1>
        <p className="text-subtle-light dark:text-subtle-dark mt-1">
          {isEditing ? 'Atualize os dados do agendamento.' : 'Agende uma sessão individual ou adicione a um grupo na clínica.'}
        </p>
      </header>

      <div className="space-y-8">
        {/* Category Toggle */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Tipo de Atendimento</h2>
          <div className="flex p-1 bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark w-full sm:w-fit">
            <button
              type="button"
              onClick={() => setCategory(AppointmentCategory.PRIVATE)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${category === AppointmentCategory.PRIVATE ? 'bg-primary text-background-dark shadow-md' : 'text-subtle-light dark:text-subtle-dark hover:bg-primary/10'}`}
            >
              <Icon name="person" />
              Atendimento Privado
            </button>
            <button
              type="button"
              onClick={() => setCategory(AppointmentCategory.CLINIC)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${category === AppointmentCategory.CLINIC ? 'bg-primary text-background-dark shadow-md' : 'text-subtle-light dark:text-subtle-dark hover:bg-primary/10'}`}
              disabled={isEditing}
            >
              <Icon name="domain" />
              Atendimento em Clínica
            </button>
          </div>
          {category === AppointmentCategory.CLINIC && (
            <p className="mt-3 text-xs text-subtle-light dark:text-subtle-dark italic">
              * Na clínica, você pode atender até 4 pacientes simultaneamente.
            </p>
          )}
        </section>

        {/* Patient Selection */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">Paciente</h2>
          <p className="text-subtle-light dark:text-subtle-dark mb-4">Inicie buscando por um paciente para preencher os detalhes.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Buscar Paciente</p>
                <select
                  value={patientId}
                  onChange={e => setPatientId(e.target.value ? Number(e.target.value) : '')}
                  className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base"
                  disabled={isEditing}
                >
                  <option value="">Busque e selecione um paciente</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {isEditing && <p className="text-xs text-subtle-light dark:text-subtle-dark mt-1">O paciente não pode ser alterado na edição.</p>}
              </label>
            </div>
            <div className="md:col-span-1 flex items-center justify-between gap-4 rounded-lg p-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">
                  {selectedPatient ? selectedPatient.name : 'Informações do Paciente'}
                </h3>
                <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal">
                  {selectedPatient
                    ? `CPF: ${selectedPatient.cpf || 'Não informado'} | Tel: ${selectedPatient.phone || 'Não informado'}`
                    : 'Selecione um paciente para ver os detalhes do endereço e contato.'}
                </p>
              </div>
              <div className="flex items-center justify-center size-16 bg-primary/20 rounded-lg text-primary">
                <Icon name="person_search" className="text-4xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Health Insurance Info - Visible only for Clinic */}
        {category === AppointmentCategory.CLINIC && (
          <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="health_and_safety" className="text-primary" />
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Plano de Saúde / Convênio</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Nome do Convênio</p>
                <select
                  value={healthPlanId}
                  onChange={(e) => setHealthPlanId(e.target.value)}
                  className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base"
                >
                  <option value="">Selecione o plano</option>
                  {healthPlans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Valor do Repasse (R$)</p>
                <input
                  value={healthPlanId ? healthPlans.find(p => p.id === Number(healthPlanId))?.value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-subtle-light dark:text-subtle-dark border border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50 h-14 px-4 text-base font-medium cursor-not-allowed"
                  placeholder="R$ 0,00"
                  type="text"
                  readOnly
                  disabled
                />
              </label>
            </div>
          </section>
        )}

        {/* Details */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Dados do Atendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Data</p>
              <input
                value={date}
                onChange={e => setDate(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base"
                type="date" />
            </label>

            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Hora</p>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base"
              >
                <option value="">Selecione o horário</option>
                {hours.map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Status</p>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base"
              >
                <option value="Pendente">Pendente</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Realizado">Realizado</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Faltou">Faltou</option>
              </select>
            </label>

            {category === AppointmentCategory.CLINIC && (
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Sala na Clínica</p>
                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base">
                  <option value="no_room">Selecione uma sala</option>
                  <option value="room1">Sala 1 (Livre)</option>
                  <option value="room2">Sala 2 (Livre)</option>
                  <option value="room3">Sala 3 (Ocupada)</option>
                  <option value="room4">Sala 4 (Livre)</option>
                </select>
              </label>
            )}
          </div>

          <div className="mt-6">
            <label className="flex flex-col w-full">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Observações</p>
              <textarea value={observations} onChange={e => setObservations(e.target.value)} className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark min-h-28 px-4 py-3 text-base" placeholder="Adicione notas sobre o atendimento..."></textarea>
            </label>
          </div>
        </section>

        <div className="flex justify-between items-center gap-4 pt-4">
          {error && (
            <div className="flex-1 text-left p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <Icon name="error" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex items-center gap-4 ml-auto">
            <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-lg text-base font-bold text-text-light dark:text-text-dark bg-transparent hover:bg-primary/20 transition-colors" type="button">Cancelar</button>
            <button
              disabled={isSubmitting}
              className="px-8 py-3 rounded-lg text-base font-bold text-background-dark bg-primary hover:bg-opacity-90 transition-colors disabled:opacity-60"
              type="submit"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Agendamento'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
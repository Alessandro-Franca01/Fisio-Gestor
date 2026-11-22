import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Field, SelectField, TextAreaField, TextField, inputClass } from '../components/form';
import { ScheduleEditor } from '../components/session/ScheduleEditor';
import { PaymentSection } from '../components/session/PaymentSection';
import { hours } from './Agenda';
import sessionService from '../services/sessionService';
import patientService, { Patient } from '../services/patientService';
import { getHealthPlans, HealthPlan } from '../services/healthPlanService';
import { AppointmentCategory } from '../types';
import { formatBRL, parseBRL } from '../utils/currency';
import { generateAppointments, ScheduleSlot } from '../utils/sessionSchedule';

interface SessionForm {
  patient_id: string;
  title: string;
  total_appointments: string;
  total_value: string;
  start_date: string;
  observations: string;
  schedules: ScheduleSlot[];
  category: AppointmentCategory;
  room: string;
  health_plan_id: string;
}

const DEFAULT_SLOT: ScheduleSlot = { day_of_week: 'Segunda-feira', time: '09:00' };

const initialForm = (patientId = ''): SessionForm => ({
  patient_id: patientId,
  title: '',
  total_appointments: '',
  total_value: '',
  start_date: new Date().toISOString().split('T')[0],
  observations: '',
  schedules: [DEFAULT_SLOT],
  category: AppointmentCategory.PRIVATE,
  room: 'no_room',
  health_plan_id: '',
});

const categoryButtonClass = (active: boolean, locked: boolean) =>
  `flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
    active ? 'bg-primary text-background-dark shadow-md' : 'text-subtle-light dark:text-subtle-dark hover:bg-primary/10'
  } ${locked ? 'opacity-60 cursor-not-allowed' : ''}`;

export const SessionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditing = !!id;
  const prefilledPatientId = location.state?.patientId?.toString() || '';

  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [formData, setFormData] = useState<SessionForm>(() => initialForm(prefilledPatientId));

  // Pagamento
  const [isPaid, setIsPaid] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');

  const set = <K extends keyof SessionForm>(key: K) => (value: SessionForm[K]) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const selectedPlan = formData.health_plan_id
    ? healthPlans.find(p => p.id === Number(formData.health_plan_id))
    : undefined;

  useEffect(() => {
    patientService
      .getPatients({ per_page: 100 })
      .then(response => {
        const data = response?.data || (Array.isArray(response) ? response : []);
        setPatients(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Failed to fetch patients', error);
        setPatients([]);
      });

    getHealthPlans()
      .then(plans => setHealthPlans(Array.isArray(plans) ? plans : []))
      .catch(error => {
        console.error('Failed to fetch health plans', error);
        setHealthPlans([]);
      });
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const session: any = await sessionService.getSessionById(id);
        setFormData({
          patient_id: session.patient_id.toString(),
          title: session.title || '',
          total_appointments: session.total_appointments.toString(),
          total_value: session.total_value.toString(),
          start_date: session.start_date.split('T')[0],
          observations: session.observations || '',
          schedules: session.schedules?.length
            ? session.schedules.map((s: any) => ({ day_of_week: s.day_of_week, time: s.time.substring(0, 5) }))
            : [DEFAULT_SLOT],
          category: session.category || AppointmentCategory.PRIVATE,
          room: session.room || '',
          health_plan_id: session.health_plan_id ? String(session.health_plan_id) : '',
        });
      } catch (error) {
        console.error('Failed to fetch session', error);
        alert('Erro ao carregar os dados da sessão.');
        navigate('/sessions');
      }
    })();
  }, [isEditing, id, navigate]);

  // Com convênio, o valor total é derivado do valor do plano x nº de atendimentos
  useEffect(() => {
    if (!formData.health_plan_id) return;
    const count = parseInt(formData.total_appointments) || 0;
    const total = (count * (selectedPlan?.value || 0)).toFixed(2);
    setFormData(prev => ({ ...prev, total_value: total }));
  }, [formData.health_plan_id, formData.total_appointments, selectedPlan]);

  // Mantém o valor do pagamento sincronizado com o valor total
  useEffect(() => {
    const val = parseFloat(formData.total_value);
    if (formData.total_value && !isNaN(val)) setPaymentAmount(formatBRL(val));
  }, [formData.total_value]);

  // Convênio de clínica: forma de pagamento fixa
  useEffect(() => {
    if (formData.category === AppointmentCategory.CLINIC && formData.health_plan_id) {
      setIsPaid(false);
      setPaymentMethod('Convenio');
    }
  }, [formData.category, formData.health_plan_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id) {
      alert('Por favor, selecione um paciente');
      return;
    }

    const base = {
      ...formData,
      total_appointments: parseInt(formData.total_appointments),
      total_value: parseFloat(formData.total_value.replace(',', '.')),
    };

    setLoading(true);
    try {
      if (isEditing) {
        await sessionService.updateSession(id!, base);
      } else {
        await sessionService.createSession({
          ...base,
          appointments: generateAppointments({
            totalAppointments: base.total_appointments,
            startDate: formData.start_date,
            schedules: formData.schedules,
            category: formData.category,
            room: formData.room,
            healthPlanId: formData.health_plan_id,
          }),
          is_paid: isPaid,
          payment_amount: paymentAmount ? parseBRL(paymentAmount) : null,
          payment_method: paymentMethod,
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

  const handleCancelSession = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await sessionService.cancelSession(id);
      navigate('/sessions');
    } catch (error) {
      console.error('Failed to cancel session', error);
      alert('Erro ao cancelar a sessão. Tente novamente.');
    } finally {
      setLoading(false);
      setShowCancelModal(false);
    }
  };

  const primaryButton =
    'flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 disabled:opacity-50';
  const isClinic = formData.category === AppointmentCategory.CLINIC;

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
            {isEditing ? 'Editar Sessão' : 'Cadastro de Sessão'}
          </p>
          <button type="submit" disabled={loading} className={primaryButton}>
            <span className="truncate">{loading ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>

        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 md:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Tipo de Atendimento</h2>
              <div className="flex p-1 bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark w-full sm:w-fit">
                <button
                  type="button"
                  onClick={() => !isEditing && setFormData(prev => ({ ...prev, category: AppointmentCategory.PRIVATE, health_plan_id: '' }))}
                  disabled={isEditing}
                  className={categoryButtonClass(!isClinic, isEditing)}
                >
                  <Icon name="person" />
                  Atendimento Privado
                </button>
                <button
                  type="button"
                  onClick={() => !isEditing && set('category')(AppointmentCategory.CLINIC)}
                  className={categoryButtonClass(isClinic, isEditing)}
                  disabled={isEditing}
                >
                  <Icon name="domain" />
                  Atendimento em Clínica
                </button>
              </div>
              {isClinic && (
                <p className="mt-3 text-xs text-subtle-light dark:text-subtle-dark italic">
                  * Na clínica, você pode atender até 4 pacientes simultaneamente.
                </p>
              )}
            </div>

            {isClinic && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-background-light/50 dark:bg-background-dark/50 rounded-lg border border-border-light dark:border-border-dark animate-in fade-in slide-in-from-top-2">
                <div className="md:col-span-2 flex items-center gap-2">
                  <Icon name="health_and_safety" className="text-primary" />
                  <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Plano de Saúde / Convênio</h3>
                </div>
                <SelectField
                  label="Nome do Convênio"
                  placeholder="Selecione o plano"
                  disabled={isEditing}
                  value={formData.health_plan_id}
                  onChange={set('health_plan_id')}
                  options={healthPlans.filter(Boolean).map(p => ({ value: String(p.id), label: p.name }))}
                />
                <Field label="Valor do Repasse (R$)">
                  <input
                    value={selectedPlan?.value != null ? formatBRL(selectedPlan.value) : ''}
                    className={inputClass}
                    placeholder="R$ 0,00"
                    type="text"
                    readOnly
                    disabled
                  />
                </Field>
              </div>
            )}

            <SelectField
              label="Paciente"
              className="md:col-span-2"
              required
              disabled={isEditing}
              placeholder="Selecione um paciente"
              value={formData.patient_id}
              onChange={set('patient_id')}
              options={patients.filter(Boolean).map(p => ({ value: String(p.id), label: p.name }))}
              hint={isEditing ? 'O paciente não pode ser alterado após a criação.' : undefined}
            />

            <TextField
              label="Título do Tratamento (Opcional)"
              className="md:col-span-2"
              value={formData.title}
              onChange={set('title')}
              placeholder="Ex: Reabilitação de Joelho"
            />

            <TextField
              label="Número de Atendimentos"
              type="number"
              min="1"
              required
              disabled={isEditing}
              value={formData.total_appointments}
              onChange={set('total_appointments')}
              placeholder="Ex: 10"
            />

            <TextField
              label="Valor Total (R$)"
              required={!formData.health_plan_id}
              disabled={!!formData.health_plan_id || isEditing}
              value={formData.total_value}
              onChange={set('total_value')}
              placeholder="0.00"
            />

            <TextField
              label="Data de Início"
              className="md:col-span-2"
              type="date"
              required
              disabled={isEditing}
              value={formData.start_date}
              onChange={set('start_date')}
            />

            <div className="md:col-span-2">
              <ScheduleEditor disabled={isEditing} schedules={formData.schedules} hours={Array.isArray(hours) ? hours : []} onChange={set('schedules')} />
            </div>

            <TextAreaField
              label="Observações"
              className="md:col-span-2"
              rows={4}
              value={formData.observations}
              onChange={set('observations')}
              placeholder="Digite aqui suas observações..."
            />
          </div>

          {!isEditing && (
            <PaymentSection
              isPaid={isPaid}
              amount={paymentAmount}
              method={paymentMethod}
              onIsPaidChange={setIsPaid}
              onAmountChange={setPaymentAmount}
              onMethodChange={setPaymentMethod}
            />
          )}

          <div className="mt-8 flex flex-wrap justify-end gap-4 border-t border-border-light dark:border-border-dark pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/10"
            >
              <span className="truncate">Voltar</span>
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-500/20 transition-all"
              >
                <Icon name="cancel" />
                <span className="truncate">Cancelar Sessão</span>
              </button>
            )}
            <button type="submit" disabled={loading} className={primaryButton}>
              <span className="truncate">{loading ? 'Salvando...' : 'Salvar Sessão'}</span>
            </button>
          </div>
        </div>
      </form>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-surface-light dark:bg-surface-dark p-6 shadow-xl border border-border-light dark:border-border-dark animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <Icon name="warning" className="text-3xl" />
              <h3 className="text-xl font-bold">Cancelar Sessão</h3>
            </div>
            <p className="text-subtle-light dark:text-subtle-dark mb-6">
              Tem certeza que deseja cancelar esta sessão? Todos os atendimentos que estão <strong>pendentes</strong> serão cancelados. Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg font-bold text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleCancelSession}
                disabled={loading}
                className="px-4 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {loading ? 'Cancelando...' : 'Sim, Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

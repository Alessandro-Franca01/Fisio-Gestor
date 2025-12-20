import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import sessionService from '../services/sessionService';
import patientService, { Patient } from '../services/patientService';

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
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [formData, setFormData] = useState({
    patient_id: '',
    title: '',
    total_appointments: '',
    total_value: '',
    start_date: new Date().toISOString().split('T')[0],
    observations: '',
    schedules: [{ day_of_week: 'Segunda-feira', time: '09:00' }]
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id) {
      alert('Por favor, selecione um paciente');
      return;
    }

    setLoading(true);
    try {
      await sessionService.createSession({
        ...formData,
        total_appointments: parseInt(formData.total_appointments),
        total_value: parseFloat(formData.total_value.replace(',', '.'))
      });
      navigate('/sessions');
    } catch (error) {
      console.error('Failed to create session', error);
      alert('Erro ao criar sessão. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Cadastro de Sessão</p>
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
            <div className="md:col-span-2">
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Paciente</p>
                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
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
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
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
                      <input
                        type="time"
                        value={slot.time}
                        onChange={(e) => handleScheduleChange(i, 'time', e.target.value)}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base"
                      />
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


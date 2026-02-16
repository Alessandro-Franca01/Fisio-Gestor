import React, { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { useNavigate, useParams } from 'react-router-dom';
import { getAppointmentById, executeAppointment } from '../services/appointmentService';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AppointmentExecute: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [appointment, setAppointment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [treatmentObjectives, setTreatmentObjectives] = useState<string>('');
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [isSubmittingExecute, setIsSubmittingExecute] = useState(false);

  const availableResources = [
    'Cinesioterapia',
    'Eletroterapia',
    'Termoterapia',
    'Crioterapia',
    'Terapia Manual',
    'Outros'
  ];

  const toggleResource = (resource: string) => {
    setSelectedResources(prev =>
      prev.includes(resource)
        ? prev.filter(r => r !== resource)
        : [...prev, resource]
    );
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAppointmentById(id);
        setAppointment(data);
        setStartTime(data?.start_time ?? data?.scheduled_time ?? '');
        setEndTime(data?.end_time ?? '');
        setSessionNotes(data?.session_notes ?? '');
        setTreatmentObjectives(data?.treatment_objectives ?? '');
        setSelectedResources(data?.resources && Array.isArray(data?.resources) ? data.resources : []);
      } catch (err: any) {
        console.error('Failed to load appointment:', err);
        setError('Erro ao carregar agendamento.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDisplayDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '—';

    try {
      // Cria a data do jeito que o backend está enviando
      const date = new Date(dateStr);

      // Se a data termina com Z (UTC), extrai os componentes UTC
      if (dateStr.endsWith('Z')) {
        // Usa os componentes UTC para criar uma data local
        const localDate = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          12, 0, 0
        );

        return format(localDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
      }

      // Para datas sem Z, usa normalmente
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return dateStr;
    }
  };

  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return '—';
    try {
      if (timeStr.includes('T')) {
        const parts = timeStr.split('T')[1];
        return parts.substring(0, 5);
      }
      return timeStr.substring(0, 5);
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto flex-1">
      {isLoading ? (
        <div className="p-8 text-center">Carregando agendamento...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : appointment ? (
        <>
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between gap-3 mb-6">
            <div className="flex min-w-72 flex-col gap-2">
              <p className="text-text-light dark:text-text-dark text-3xl font-bold leading-tight tracking-tight">Execução do Atendimento</p>
              <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Registre os detalhes do atendimento para o paciente.</p>
            </div>
            <button
              onClick={() => navigate(`/appointments/${id}/edit`)}
              className="flex h-10 px-4 items-center gap-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="edit" />
              Editar
            </button>
          </div>

          {/* Card */}
          <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-full sm:w-1/3 bg-center bg-no-repeat aspect-video sm:aspect-square bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUQD9uE96PgKKDbUpfn4pKxnPB_U7CNBL5hEQ0L38-Nsq9TC0QNJXPUub4YTsUrWu0DmDIYqQkgheDHqx-p4APn8vu397bgSbKptzbPq4Gy07msp_yqxrrXTYJZKaAYsuEB4rDfIPdOp5Asq5y9FMZZ0N2djK5m8Y7-cOpLQ-9TAPzjpO5PEs9C_ARvzUEBGvD2iO4JOyWKrP2O_HMMGa8-HgUTyob4yuty08rt9SkkSR__HSn6piZ0jjv-gyN7OHdFkVhsEWU0fQ")' }}></div>
              {/* <div className="w-full sm:w-1/3 bg-center bg-no-repeat aspect-video sm:aspect-square bg-cover rounded-lg" style={{ backgroundImage: `url(${appointment.patient?.avatar_url || ''})` }}></div> */}
              <div className="flex w-full min-w-72 grow flex-col justify-center gap-2 py-2">
                <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal">Detalhes do Agendamento</p>
                <p className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">Paciente: {appointment.patient?.name ?? appointment.patient_name ?? '—'}</p>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal flex items-center gap-2">
                    <Icon name="event" /> Data: {formatDisplayDate(appointment.date)} - {formatTime(appointment.scheduled_time)}
                  </p>
                  <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal flex items-center gap-2">
                    <Icon name="check_circle" /> Local: {appointment.address?.full_address ?? appointment.patient?.address ?? 'Não informado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Horário */}
            <div>
              <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight pb-3 border-b border-border-light dark:border-border-dark">Horário do Atendimento</h3>
              <div className="flex flex-wrap items-end gap-4 pt-5">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Início do Atendimento</p>
                  <input value={startTime} onChange={e => setStartTime(e.target.value)} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base" type="time" />
                </label>
                <button className="h-12 px-6 bg-primary/20 dark:bg-primary/30 text-text-light dark:text-text-dark rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/30">
                  <Icon name="login" /> Check-in
                </button>
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Término do Atendimento</p>
                  <input value={endTime} onChange={e => setEndTime(e.target.value)} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base" type="time" />
                </label>
                <button className="h-12 px-6 bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-80">
                  <Icon name="logout" /> Check-out
                </button>
              </div>
            </div>

            {/* Observações */}
            <div>
              <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight pb-3 border-b border-border-light dark:border-border-dark">Observações da Sessão</h3>
              <div className="pt-5">
                <textarea value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} className="form-textarea w-full resize-y rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark min-h-36 p-4 text-base" placeholder="Descreva a evolução do paciente, exercícios realizados, intercorrências, etc."></textarea>
              </div>
            </div>

            {/* Conduta Fisioterapêutica */}
            <div>
              <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight pb-3 border-b border-border-light dark:border-border-dark">Conduta Fisioterapêutica</h3>

              <div className="pt-5 space-y-6">
                <div>
                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Objetivos do Tratamento:</p>
                  <textarea
                    value={treatmentObjectives}
                    onChange={e => setTreatmentObjectives(e.target.value)}
                    className="form-textarea w-full resize-y rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark min-h-24 p-4 text-base"
                    placeholder="Descreva os objetivos do tratamento para esta sessão."
                  ></textarea>
                </div>

                <div>
                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Recursos Utilizados:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableResources.map(resource => (
                      <label key={resource} className="flex items-center gap-2 cursor-pointer p-3 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedResources.includes(resource)}
                          onChange={() => toggleResource(resource)}
                          className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <span className="text-text-light dark:text-text-dark text-sm font-medium">{resource}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Anexar Foto */}
            <div>
              <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight pb-3 border-b border-border-light dark:border-border-dark">Anexar Foto (Opcional)</h3>
              <div className="mt-5 flex justify-center rounded-lg border-2 border-dashed border-border-light dark:border-border-dark px-6 py-10">
                <div className="text-center">
                  <Icon name="upload_file" className="text-5xl text-subtle-light dark:text-subtle-dark" />
                  <div className="mt-4 flex text-sm leading-6 text-subtle-light dark:text-subtle-dark">
                    <label className="relative cursor-pointer rounded-md font-semibold text-primary hover:underline">
                      <span>Clique para selecionar</span>
                      <input type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">ou arraste um arquivo</p>
                  </div>
                  <p className="text-xs leading-5 text-subtle-light dark:text-subtle-dark">PNG, JPG, GIF até 10MB</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-4 mt-10 pt-6 border-t border-border-light dark:border-border-dark">
              <button onClick={() => navigate('/dashboard')} className="h-12 px-6 text-text-light dark:text-text-dark rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors">Cancelar</button>
              <button onClick={async () => {
                if (!id) return;
                setIsSubmittingExecute(true);
                setError(null);
                try {
                  await executeAppointment(id, {
                    start_time: startTime,
                    end_time: endTime,
                    session_notes: sessionNotes || null,
                    status: 'Realizado',
                    treatment_objectives: treatmentObjectives || undefined,
                    resources: selectedResources.length > 0 ? selectedResources : undefined
                  });
                  navigate('/agenda');
                } catch (err) {
                  console.error('Execute failed:', err);
                  setError('Erro ao concluir atendimento.');
                } finally {
                  setIsSubmittingExecute(false);
                }
              }} disabled={isSubmittingExecute} className="h-12 px-8 bg-primary text-background-dark rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-colors">
                <Icon name="check_circle" />
                {isSubmittingExecute ? 'Concluindo...' : 'Concluir Atendimento'}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

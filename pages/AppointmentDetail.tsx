import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { getAppointmentById, updateAppointmentStatus } from '../services/appointmentService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AppointmentDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [appointment, setAppointment] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getAppointmentById(id);
                setAppointment(data);
            } catch (error) {
                console.error('Failed to fetch appointment details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointment();
    }, [id]);

    const handleStatusChange = async (newStatus: 'Confirmado' | 'Cancelado' | 'Pendente') => {
        if (!id) return;
        try {
            await updateAppointmentStatus(id, newStatus);
            // Refresh data
            const updated = await getAppointmentById(id);
            setAppointment(updated);
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Erro ao atualizar status.');
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-subtle-light dark:text-subtle-dark">Carregando detalhes do atendimento...</p>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <p className="text-subtle-light dark:text-subtle-dark">Atendimento não encontrado.</p>
                <button onClick={() => navigate('/agenda')} className="text-primary font-bold hover:underline">Voltar para a Agenda</button>
            </div>
        );
    }

    const isDone = appointment.status === 'Realizado';
    const isCanceled = appointment.status === 'Cancelado';

    return (
        <div className="mx-auto max-w-5xl">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium hover:text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
                <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium">/</span>
                <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium hover:text-primary cursor-pointer" onClick={() => navigate('/agenda')}>Agenda</span>
                <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium">/</span>
                <span className="text-text-light dark:text-text-dark text-sm font-medium">Detalhes do Atendimento</span>
            </div>

            <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Atendimento</h1>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                              ${appointment.status === 'Realizado' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : ''}
                              ${appointment.status === 'Agendado' || appointment.status === 'Confirmado' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' : ''}
                              ${appointment.status === 'Pendente' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' : ''}
                              ${appointment.status === 'Cancelado' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : ''}
                          `}>
                            {appointment.status}
                        </span>
                        <span className="text-subtle-light dark:text-subtle-dark text-sm">
                            {format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} • {appointment.scheduled_time?.substring(0, 5)}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    {!isDone && !isCanceled && (
                        <button
                            onClick={() => navigate(`/appointments/${appointment.id}/execute`)}
                            className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold shadow-sm hover:opacity-90 transition-colors"
                        >
                            <Icon name="play_arrow" />
                            <span className="truncate">Iniciar / Executar</span>
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                        className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark text-sm font-bold shadow-sm hover:bg-primary/10 transition-colors"
                    >
                        <Icon name="edit" />
                        <span className="truncate">Editar</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Patient Info */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-4 border-b border-border-light dark:border-border-dark pb-2">Paciente</h2>
                    <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center size-12 bg-primary/20 rounded-full text-primary">
                            <Icon name="person" className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-text-light dark:text-text-dark">{appointment.patient?.name}</p>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark">{appointment.patient?.phone || 'Telefone não informado'}</p>
                            <button onClick={() => navigate(`/patients/${appointment.patient_id}`)} className="text-primary text-sm font-medium hover:underline mt-1 block">Ver Perfil Completo</button>
                        </div>
                    </div>
                </div>

                {/* Session Info (if any) */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-4 border-b border-border-light dark:border-border-dark pb-2">Detalhes da Sessão</h2>
                    {appointment.session ? (
                        <div>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark">Parte de um tratamento:</p>
                            <p className="text-base font-bold text-text-light dark:text-text-dark mb-2">{appointment.session.title || 'Sessão #' + appointment.session.id}</p>
                            <button onClick={() => navigate(`/sessions/${appointment.session_id}`)} className="text-primary text-sm font-medium hover:underline">Ver Detalhes do Tratamento</button>
                        </div>
                    ) : (
                        <p className="text-subtle-light dark:text-subtle-dark">Este é um atendimento avulso, não vinculado a um pacote de sessões.</p>
                    )}
                </div>
            </div>

            {/* Details & Notes */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm mb-8">
                <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-6">Informações do Procedimento</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Tipo</p>
                        <p className="text-base font-medium text-text-light dark:text-text-dark flex items-center gap-2">
                            <Icon name="category" className="text-primary" />
                            {appointment.type}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Localização</p>
                        <p className="text-base font-medium text-text-light dark:text-text-dark">
                            {appointment.category === 'clinic' ? `Clínica - ${appointment.room || 'Sem sala'}` : 'Domiciliar'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Horário Previsto</p>
                        <p className="text-base font-medium text-text-light dark:text-text-dark">
                            {appointment.scheduled_time?.substring(0, 5)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Horário Realizado</p>
                        <p className="text-base font-medium text-text-light dark:text-text-dark">
                            {appointment.start_time ? `${appointment.start_time?.substring(0, 5)} - ${appointment.end_time?.substring(0, 5)}` : 'Não registrado'}
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm text-subtle-light dark:text-subtle-dark mb-2">Observações / Anotações</p>
                        <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark min-h-24">
                            {appointment.observations ? (
                                <p className="text-text-light dark:text-text-dark whitespace-pre-wrap">{appointment.observations}</p>
                            ) : (
                                <p className="text-subtle-light dark:text-subtle-dark italic">Nenhuma observação registrada.</p>
                            )}
                        </div>
                    </div>
                    {isDone && (
                        <>
                            <div className="md:col-span-2">
                                <p className="text-sm text-subtle-light dark:text-subtle-dark mb-2">Evolução do Paciente (Notas da Execução)</p>
                                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800/30 min-h-24">
                                    {appointment.session_notes ? (
                                        <p className="text-text-light dark:text-text-dark whitespace-pre-wrap">{appointment.session_notes}</p>
                                    ) : (
                                        <p className="text-subtle-light dark:text-subtle-dark italic">Nenhuma nota de evolução registrada.</p>
                                    )}
                                </div>
                            </div>
                            {appointment.resources && Array.isArray(appointment.resources) && appointment.resources.length > 0 && (
                                <div className="md:col-span-2 mt-2">
                                    <p className="text-sm text-subtle-light dark:text-subtle-dark mb-2">Recursos Utilizados (Conduta)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {appointment.resources.map((resource: string, index: number) => (
                                            <span key={index} className="inline-flex items-center rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-1 text-sm font-medium text-primary border border-primary/20">
                                                {resource}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Actions Footer */}
            {!isDone && (
                <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                    {!isCanceled && (
                        <button
                            onClick={() => handleStatusChange('Cancelado')}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
                        >
                            Cancelar Agendamento
                        </button>
                    )}
                    {isCanceled && (
                        <button
                            onClick={() => handleStatusChange('Pendente')}
                            className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg font-medium transition-colors"
                        >
                            Reativar Agendamento
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

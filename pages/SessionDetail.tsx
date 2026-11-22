import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import sessionService, { Session } from '../services/sessionService';

export const SessionDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportComment, setReportComment] = useState('');
    const [generating, setGenerating] = useState(false);
    const [reportError, setReportError] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        if (!id) return;
        setGenerating(true);
        setReportError(null);
        try {
            await sessionService.generateSessionReport(id, reportComment);
            navigate(`/sessions/${id}/report`);
        } catch (e: any) {
            setReportError(e?.response?.data?.errors?.comment?.[0] || e?.response?.data?.message || 'Erro ao gerar o relatório.');
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        const fetchSession = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await sessionService.getSessionById(id);
                setSession(data);
            } catch (error) {
                console.error('Failed to fetch session details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-subtle-light dark:text-subtle-dark">Carregando detalhes da sessão...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <p className="text-subtle-light dark:text-subtle-dark">Sessão não encontrada.</p>
                <button onClick={() => navigate('/sessions')} className="text-primary font-bold hover:underline">Voltar para a lista</button>
            </div>
        );
    }

    const completed = session.appointments?.filter(a => a.status === 'Realizado' || a.status === 'Faltou').length || 0;
    const total = session.total_appointments;
    const progress = (completed / total) * 100;
    const OPEN_STATUSES = ['Agendado', 'Pendente', 'Confirmado'];
    const canGenerateReport =
        !!session.appointments?.length && !session.appointments.some(a => OPEN_STATUSES.includes(a.status));
    const hasReport = !!session.report_generated_at;

    const totalValue = Number(session.total_value) || 0;
    const totalPaid = session.payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
    const remainingValue = totalValue - totalPaid;

    const recurrence = session.schedules
        ? session.schedules.map(s => `${s.day_of_week} às ${s.time.substring(0, 5)}`).join(', ')
        : 'Não definida';

    return (
        <div className="mx-auto max-w-5xl">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium hover:text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
                <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium">/</span>
                <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium hover:text-primary cursor-pointer" onClick={() => navigate('/sessions')}>Sessões</span>
                <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium">/</span>
                <span className="text-text-light dark:text-text-dark text-sm font-medium">Detalhes da Sessão</span>
            </div>

            <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">{session.title || 'Sem título'}</h1>
                    <div className="flex items-center gap-2 text-subtle-light dark:text-subtle-dark">
                        <Icon name="person_search" className="text-lg" />
                        <span className="text-base font-normal leading-normal cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/patients/${session.patient_id}`)}>Paciente: {session.patient?.name}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/sessions/${session.id}/edit`)}
                        className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark text-sm font-bold shadow-sm hover:bg-primary/10 transition-colors"
                    >
                        <Icon name="edit" />
                        <span className="truncate">Editar</span>
                    </button>
                    {canGenerateReport && (
                        <>
                            {hasReport && (
                                <button
                                    onClick={() => navigate(`/sessions/${session.id}/report`)}
                                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark text-sm font-bold shadow-sm hover:bg-primary/10 transition-colors"
                                >
                                    <Icon name="description" />
                                    <span className="truncate">Ver Relatório</span>
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setReportComment(session.report_comment ?? '');
                                    setReportError(null);
                                    setShowReportModal(true);
                                }}
                                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold shadow-sm hover:opacity-90"
                            >
                                <Icon name="summarize" />
                                <span className="truncate">{hasReport ? 'Gerar Novamente' : 'Gerar Relatório da Sessão'}</span>
                            </button>
                        </>
                    )}
                    <button className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide shadow-sm hover:opacity-90">
                        <Icon name="add_circle" />
                        <span className="truncate">Agendar Atendimento</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Progress Card */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">Progresso do Tratamento</h2>
                    <div className="mb-2 flex justify-between items-end">
                        <span className="text-4xl font-black text-primary">{completed}<span className="text-2xl text-subtle-light dark:text-subtle-dark font-medium">/{total}</span></span>
                        <span className="text-sm font-medium text-subtle-light dark:text-subtle-dark">{Math.round(progress)}% Concluído</span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark overflow-hidden mb-6">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border-light dark:border-border-dark pt-6">
                        <div>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Início</p>
                            {/* (`${item.date.substring(0, 10)}T${item.scheduled_time.substring(0, 5)}`) */}
                            <p className="font-semibold text-text-light dark:text-text-dark">{new Date(session.start_date.substring(0, 10) + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Status</p>
                            <p className="font-semibold text-text-light dark:text-text-dark">{session.status}</p>
                        </div>
                        <div>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Frequência</p>
                            <p className="font-semibold text-xs text-text-light dark:text-text-dark">{recurrence}</p>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-center">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-6">Resumo Financeiro</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-subtle-light dark:text-subtle-dark">Valor Total</span>
                            <span className="text-xl font-bold text-text-light dark:text-text-dark">R$ {totalValue.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-subtle-light dark:text-subtle-dark">Pago</span>
                            <span className="text-lg font-medium text-green-600 dark:text-green-400">R$ {totalPaid.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border-light dark:border-border-dark">
                            <span className="text-subtle-light dark:text-subtle-dark">Restante</span>
                            <span className="text-lg font-medium text-red-500">R$ {remainingValue.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                    <button className="mt-6 w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg transition-colors">
                        Gerenciar Pagamentos
                    </button>
                </div>
            </div>

            {/* History List */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark">Histórico de Atendimentos</h2>
                    <div className="flex gap-2">
                        <button className="p-2 text-subtle-light dark:text-subtle-dark hover:text-primary"><Icon name="filter_list" /></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background-light dark:bg-background-dark text-xs uppercase text-subtle-light dark:text-subtle-dark font-semibold">
                            <tr>
                                <th className="p-4">Data/Hora</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Evolução</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                            {session.appointments && session.appointments.length > 0 ? (
                                session.appointments.map((item) => (
                                    <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="p-4 font-medium text-text-light dark:text-text-dark">
                                            {item.date && item.scheduled_time ? (
                                                new Date(`${item.date.substring(0, 10)}T${item.scheduled_time.substring(0, 5)}`).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                                            ) : '-'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                      ${item.status === 'Realizado' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : ''}
                                      ${item.status === 'Agendado' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' : ''}
                                      ${item.status === 'Cancelado' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : ''}
                                      ${item.status === 'Faltou' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : ''}
                                  `}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-subtle-light dark:text-subtle-dark max-w-xs truncate">
                                            {item.summary || '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                className="text-primary font-bold hover:underline"
                                                onClick={() => navigate(`/appointments/${item.id}`)}
                                            >
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-subtle-light dark:text-subtle-dark">
                                        Nenhum atendimento registrado para esta sessão.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showReportModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => !generating && setShowReportModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Gerar relatório da sessão"
                >
                    <div
                        className="w-full max-w-lg rounded-xl bg-surface-light dark:bg-surface-dark p-6 shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Gerar relatório da sessão</h3>
                        <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
                            Se quiser, adicione um comentário que será incluído no relatório.
                        </p>
                        <label className="mt-4 block text-sm font-medium text-text-light dark:text-text-dark" htmlFor="report-comment">
                            Comentário (opcional)
                        </label>
                        <textarea
                            id="report-comment"
                            value={reportComment}
                            onChange={e => setReportComment(e.target.value)}
                            maxLength={5000}
                            rows={6}
                            autoFocus
                            placeholder="Ex.: evolução geral do paciente, orientações, recomendações..."
                            className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-3 text-sm text-text-light dark:text-text-dark focus:border-primary focus:outline-none"
                        />
                        {reportError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{reportError}</p>}
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setShowReportModal(false)}
                                disabled={generating}
                                className="h-10 rounded-lg border border-border-light dark:border-border-dark px-4 text-sm font-bold text-text-light dark:text-text-dark hover:bg-primary/10 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGenerateReport}
                                disabled={generating}
                                className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-background-dark hover:opacity-90 disabled:opacity-50"
                            >
                                {generating ? 'Gerando...' : 'Confirmar e gerar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

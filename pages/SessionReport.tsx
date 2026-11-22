import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import sessionService, { SessionReport } from '../services/sessionService';
import { formatBRL } from '../utils/currency';

const fmtDate = (d?: string | null) => (d ? new Date(d.substring(0, 10) + 'T00:00:00').toLocaleDateString('pt-BR') : '-');

// Ao imprimir, mostra somente o relatório (o usuário escolhe "Salvar como PDF" no diálogo).
const PRINT_CSS = `
@media print {
  body * { visibility: hidden !important; }
  #report-print, #report-print * { visibility: visible !important; }
  #report-print { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border: none !important; }
  @page { margin: 14mm; }
}`;

export const SessionReportPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [report, setReport] = useState<SessionReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        sessionService
            .getSessionReport(id)
            .then(setReport)
            .catch((e: any) => setError(e?.response?.data?.message || 'Erro ao carregar o relatório.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-subtle-light dark:text-subtle-dark">Carregando relatório...</p>;
    if (error || !report) {
        return (
            <div className="flex flex-col items-center gap-4 pt-16">
                <p className="text-subtle-light dark:text-subtle-dark">{error || 'Relatório não encontrado.'}</p>
                <button onClick={() => navigate(`/sessions/${id}`)} className="text-primary font-bold hover:underline">
                    Voltar para a sessão
                </button>
            </div>
        );
    }

    const { session, summary, comment, generated_at } = report;
    const appointments = session.appointments ?? [];

    return (
        <div className="mx-auto max-w-4xl">
            <style>{PRINT_CSS}</style>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <button
                    onClick={() => navigate(`/sessions/${id}`)}
                    className="flex items-center gap-1 text-sm font-medium text-subtle-light dark:text-subtle-dark hover:text-primary"
                >
                    <Icon name="arrow_back" className="text-lg" /> Voltar para a sessão
                </button>
                <button
                    onClick={() => window.print()}
                    className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-background-dark shadow-sm hover:opacity-90"
                >
                    <Icon name="picture_as_pdf" /> Baixar PDF
                </button>
            </div>

            <article
                id="report-print"
                className="rounded-xl border border-border-light dark:border-border-dark bg-white p-8 text-gray-900 shadow-sm"
            >
                <header className="border-b border-gray-300 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Relatório da Sessão</p>
                    <h1 className="mt-1 text-2xl font-bold">{session.title || 'Sessão de tratamento'}</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Gerado em {new Date(generated_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                </header>

                <section className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Paciente</p>
                        <p className="font-semibold">{session.patient?.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Período</p>
                        <p className="font-semibold">
                            {fmtDate(session.start_date)} a {fmtDate(appointments[appointments.length - 1]?.date)}
                        </p>
                    </div>
                    {session.health_plan?.name && (
                        <div>
                            <p className="text-gray-500">Convênio</p>
                            <p className="font-semibold">{session.health_plan.name}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-gray-500">Frequência</p>
                        <p className="font-semibold">
                            {session.schedules?.map(s => `${s.day_of_week} ${s.time.substring(0, 5)}`).join(', ') || '-'}
                        </p>
                    </div>
                </section>

                <section className="mt-6">
                    <h2 className="mb-2 text-base font-bold">Resumo</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-center text-sm">
                        {[
                            ['Atendimentos', summary.total],
                            ['Realizados', summary.realizado],
                            ['Faltas', summary.faltou],
                            ['Cancelados', summary.cancelado],
                        ].map(([label, value]) => (
                            <div key={label as string} className="rounded-lg border border-gray-300 p-3">
                                <p className="text-2xl font-bold">{value}</p>
                                <p className="text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-700">
                        Valor total {formatBRL(summary.total_value)} · Pago {formatBRL(summary.paid_value)} · Pendente{' '}
                        {formatBRL(summary.pending_value)}
                    </p>
                </section>

                {comment && (
                    <section className="mt-6">
                        <h2 className="mb-2 text-base font-bold">Comentário do profissional</h2>
                        <p className="whitespace-pre-wrap rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm">{comment}</p>
                    </section>
                )}

                <section className="mt-6">
                    <h2 className="mb-2 text-base font-bold">Histórico de atendimentos</h2>
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-400 text-xs uppercase text-gray-500">
                                <th className="py-2 pr-2">Data</th>
                                <th className="py-2 pr-2">Horário</th>
                                <th className="py-2 pr-2">Status</th>
                                <th className="py-2">Evolução</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(a => (
                                <tr key={a.id} className="border-b border-gray-200 align-top">
                                    <td className="py-2 pr-2">{fmtDate(a.date)}</td>
                                    <td className="py-2 pr-2">{a.scheduled_time?.substring(0, 5)}</td>
                                    <td className="py-2 pr-2">{a.status}</td>
                                    <td className="py-2">{a.summary || a.session_notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </article>
        </div>
    );
};

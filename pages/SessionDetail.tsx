import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const SessionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data matching the style of other pages
  const session = {
    id: '1',
    title: 'Reabilitação de Joelho',
    patientName: 'Ana Silva',
    patientId: '1',
    status: 'Em Andamento',
    startDate: '12/06/2024',
    endDate: '12/08/2024', // Estimated
    completed: 6,
    total: 10,
    price: 1500.00,
    paid: 750.00,
    recurrence: 'Segunda e Quarta, 14:00',
    history: [
       { id: 101, date: '12/06/2024', time: '14:00', status: 'Realizado', note: 'Avaliação inicial, dor 8/10.' },
       { id: 102, date: '14/06/2024', time: '14:00', status: 'Realizado', note: 'Mobilização passiva, analgesia.' },
       { id: 103, date: '19/06/2024', time: '14:00', status: 'Realizado', note: 'Início fortalecimento leve.' },
       { id: 104, date: '21/06/2024', time: '14:00', status: 'Não Compareceu', note: '-' },
       { id: 105, date: '26/06/2024', time: '14:00', status: 'Realizado', note: 'Evolução boa, dor 4/10.' },
       { id: 106, date: '28/06/2024', time: '14:00', status: 'Realizado', note: 'Exercícios de propriocepção.' },
       { id: 107, date: '03/07/2024', time: '14:00', status: 'Agendado', note: '' },
       { id: 108, date: '05/07/2024', time: '14:00', status: 'Agendado', note: '' },
    ]
  };

  const progress = (session.completed / session.total) * 100;

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
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">{session.title}</h1>
          <div className="flex items-center gap-2 text-subtle-light dark:text-subtle-dark">
             <Icon name="person_search" className="text-lg" />
             <span className="text-base font-normal leading-normal cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/patients/${session.patientId}`)}>Paciente: {session.patientName}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/sessions/${id}/edit`)}
            className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark text-sm font-bold shadow-sm hover:bg-primary/10 transition-colors"
          >
            <Icon name="edit" />
            <span className="truncate">Editar</span>
          </button>
          <button className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide shadow-sm hover:opacity-90">
            <Icon name="add_circle" />
            <span className="truncate">Agendar Sessão</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         {/* Progress Card */}
         <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">Progresso do Tratamento</h2>
            <div className="mb-2 flex justify-between items-end">
                <span className="text-4xl font-black text-primary">{session.completed}<span className="text-2xl text-subtle-light dark:text-subtle-dark font-medium">/{session.total}</span></span>
                <span className="text-sm font-medium text-subtle-light dark:text-subtle-dark">{Math.round(progress)}% Concluído</span>
            </div>
             <div className="h-4 w-full rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark overflow-hidden mb-6">
                 <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border-light dark:border-border-dark pt-6">
                 <div>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Início</p>
                    <p className="font-semibold text-text-light dark:text-text-dark">{session.startDate}</p>
                 </div>
                 <div>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Previsão de Término</p>
                    <p className="font-semibold text-text-light dark:text-text-dark">{session.endDate}</p>
                 </div>
                 <div>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">Frequência</p>
                    <p className="font-semibold text-text-light dark:text-text-dark">{session.recurrence}</p>
                 </div>
             </div>
         </div>

         {/* Financial Summary */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-center">
             <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-6">Resumo Financeiro</h2>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-subtle-light dark:text-subtle-dark">Valor Total</span>
                    <span className="text-xl font-bold text-text-light dark:text-text-dark">R$ {session.price.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-subtle-light dark:text-subtle-dark">Pago</span>
                    <span className="text-lg font-medium text-green-600 dark:text-green-400">R$ {session.paid.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-center pt-2 border-t border-border-light dark:border-border-dark">
                    <span className="text-subtle-light dark:text-subtle-dark">Restante</span>
                    <span className="text-lg font-medium text-red-500">R$ {(session.price - session.paid).toFixed(2)}</span>
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
                    {session.history.map((item) => (
                        <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                            <td className="p-4 font-medium text-text-light dark:text-text-dark">
                                {item.date} <span className="text-subtle-light dark:text-subtle-dark text-xs ml-1">{item.time}</span>
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                    ${item.status === 'Realizado' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : ''}
                                    ${item.status === 'Agendado' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' : ''}
                                    ${item.status === 'Não Compareceu' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : ''}
                                `}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-4 text-subtle-light dark:text-subtle-dark max-w-xs truncate">
                                {item.note || '-'}
                            </td>
                            <td className="p-4 text-right">
                                <button className="text-primary font-bold hover:underline" onClick={() => navigate('/appointments/execute')}>Ver Detalhes</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
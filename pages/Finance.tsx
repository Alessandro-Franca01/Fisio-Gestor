import React from 'react';
import { Icon } from '../components/Icon';

export const Finance: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap justify-between gap-3 pb-6">
        <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Módulo Financeiro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <p className="text-subtle-light dark:text-subtle-dark text-base font-medium leading-normal">Total Arrecadado (Mês)</p>
          <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">R$ 7.500,00</p>
          <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">+5.2%</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <p className="text-subtle-light dark:text-subtle-dark text-base font-medium leading-normal">Pagamentos Pendentes</p>
          <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">R$ 850,00</p>
          <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium leading-normal">+10%</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <p className="text-subtle-light dark:text-subtle-dark text-base font-medium leading-normal">Faturamento Médio por Sessão</p>
          <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">R$ 150,00</p>
          <p className="text-red-600 dark:text-red-400 text-sm font-medium leading-normal">-1.5%</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Registrar Novo Pagamento</h2>
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <label className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Paciente</p>
              <select className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-3 text-base">
                <option>Selecione um paciente</option>
                <option>Ana Silva</option>
                <option>Bruno Costa</option>
              </select>
            </label>
            <label className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Sessão/Atendimento (Opcional)</p>
              <select className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-3 text-base">
                <option>Selecione uma sessão</option>
                <option>Sessão 01/07/2024</option>
              </select>
            </label>
            <label className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Valor</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 text-base" placeholder="R$ 0,00" type="text" />
            </label>
            <div className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Forma de Pagamento</p>
              <select className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-3 text-base">
                <option>Pix</option>
                <option>Dinheiro</option>
                <option>Cartão</option>
              </select>
            </div>
            <label className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Observações</p>
              <textarea className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-3 text-base" placeholder="Adicione uma nota..."></textarea>
            </label>
            <div className="flex items-end col-span-1">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary h-12 px-6 text-base font-bold text-background-dark hover:bg-opacity-90 transition-colors" type="submit">
                Registrar Pagamento
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Histórico de Pagamentos</h2>
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background-light dark:bg-background-dark">
                <tr>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Data</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Paciente</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Valor</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Forma Pagamento</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Status</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {[
                  { date: '15/07/2024', name: 'Ana Silva', value: 'R$ 150,00', method: 'Pix', status: 'Pago', color: 'green' },
                  { date: '14/07/2024', name: 'Bruno Costa', value: 'R$ 150,00', method: 'Dinheiro', status: 'Pendente', color: 'yellow' },
                  { date: '12/07/2024', name: 'Carla Dias', value: 'R$ 300,00', method: 'Cartão', status: 'Pago', color: 'green' },
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="p-4 text-sm text-text-light dark:text-text-dark">{item.date}</td>
                    <td className="p-4 text-sm text-text-light dark:text-text-dark font-medium">{item.name}</td>
                    <td className="p-4 text-sm text-text-light dark:text-text-dark">{item.value}</td>
                    <td className="p-4 text-sm text-text-light dark:text-text-dark">{item.method}</td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${item.color === 'green' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : ''}
                        ${item.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' : ''}
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-text-light dark:text-text-dark flex justify-end gap-2">
                      <button className="p-2 rounded-md hover:bg-primary/10"><Icon name="edit" className="text-base" /></button>
                      <button className="p-2 rounded-md hover:bg-primary/10"><Icon name="delete" className="text-base" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

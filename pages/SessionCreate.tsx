import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const SessionCreate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Cadastro de Sessão</p>
        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-text-light text-sm font-bold leading-normal tracking-[0.015em]">
          <span className="truncate">Salvar</span>
        </button>
      </div>

      <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 md:p-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Paciente</p>
              <select className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base">
                <option>Selecione um paciente</option>
                <option value="Joana Silva">Joana Silva</option>
                <option value="Roberto Martins">Roberto Martins</option>
              </select>
            </label>
          </div>

          <div>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Número de Atendimentos</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base" placeholder="Ex: 10" type="number" />
            </label>
          </div>

          <div>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Valor Total (R$)</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base" placeholder="R$ 0,00" />
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Data de Início</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base" type="date" />
            </label>
          </div>

          <div className="md:col-span-2">
            <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Horários Fixos da Semana</p>
            <div className="flex flex-col gap-4">
              {[
                { day: 'Segunda-feira', time: '10:00' },
                { day: 'Quarta-feira', time: '08:00' }
              ].map((slot, i) => (
                <div key={i} className="flex items-end gap-4">
                  <label className="flex flex-col min-w-40 flex-1">
                    <select className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base" defaultValue={slot.day}>
                      <option>Segunda-feira</option>
                      <option>Terça-feira</option>
                      <option>Quarta-feira</option>
                      <option>Quinta-feira</option>
                      <option>Sexta-feira</option>
                    </select>
                  </label>
                  <label className="flex flex-col min-w-32 flex-none">
                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base" type="time" defaultValue={slot.time} />
                  </label>
                  <button className="flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-text-light dark:text-text-dark hover:bg-primary/10">
                    <Icon name="delete" className="text-red-500" />
                  </button>
                </div>
              ))}
              <button className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary/20 dark:bg-primary/30 text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/30">
                <Icon name="add" />
                <span className="truncate">Adicionar Horário</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Observações</p>
              <textarea className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark min-h-32 px-4 py-3 text-base" placeholder="Digite aqui suas observações..."></textarea>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4 border-t border-border-light dark:border-border-dark pt-6">
          <button onClick={() => navigate(-1)} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/10">
            <span className="truncate">Cancelar</span>
          </button>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-text-light text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90">
            <span className="truncate">Salvar Sessão</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const AppointmentCreate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Cadastrar Novo Atendimento</h1>
        <p className="text-subtle-light dark:text-subtle-dark mt-1">Preencha os dados abaixo para agendar uma nova consulta.</p>
      </header>
      
      <div className="space-y-8">
        {/* Patient Selection */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">Paciente</h2>
          <p className="text-subtle-light dark:text-subtle-dark mb-4">Inicie buscando por um paciente para preencher os detalhes.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Buscar Paciente</p>
                <select className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base">
                  <option value="">Busque e selecione um paciente</option>
                  <option value="1">Ana Clara Souza</option>
                  <option value="2">Bruno Medeiros</option>
                </select>
              </label>
            </div>
            <div className="md:col-span-1 flex items-center justify-between gap-4 rounded-lg p-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">Informações do Paciente</h3>
                <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal">Selecione um paciente para ver os detalhes do endereço e contato.</p>
              </div>
              <div className="flex items-center justify-center size-16 bg-primary/20 rounded-lg text-primary">
                <Icon name="person_search" className="text-4xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Detalhes do Atendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Data do Atendimento</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base" type="date" />
            </label>
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Hora do Atendimento</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base" type="time" />
            </label>
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Status</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-subtle-light dark:text-subtle-dark focus:outline-none border border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50 h-14 px-4 text-base font-medium cursor-not-allowed" readOnly type="text" value="Pendente" />
            </label>
          </div>
          <div className="mt-6">
            <label className="flex flex-col w-full">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Observações</p>
              <textarea className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark min-h-28 px-4 py-3 text-base" placeholder="Adicione notas sobre o atendimento..."></textarea>
            </label>
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4">
          <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-lg text-base font-bold text-text-light dark:text-text-dark bg-transparent hover:bg-primary/20 transition-colors" type="button">Cancelar</button>
          <button className="px-8 py-3 rounded-lg text-base font-bold text-background-dark bg-primary hover:bg-opacity-90 transition-colors" type="submit">Salvar Agendamento</button>
        </div>
      </div>
    </div>
  );
};

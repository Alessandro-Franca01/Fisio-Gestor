
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { AppointmentCategory } from '../types';

export const AppointmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<AppointmentCategory>(AppointmentCategory.PRIVATE);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Novo Atendimento</h1>
        <p className="text-subtle-light dark:text-subtle-dark mt-1">Agende uma sessão individual ou adicione a um grupo na clínica.</p>
      </header>
      
      <div className="space-y-8">
        {/* Category Toggle */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
           <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Tipo de Atendimento</h2>
           <div className="flex p-1 bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark w-full sm:w-fit">
              <button 
                onClick={() => setCategory(AppointmentCategory.PRIVATE)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${category === AppointmentCategory.PRIVATE ? 'bg-primary text-background-dark shadow-md' : 'text-subtle-light dark:text-subtle-dark hover:bg-primary/10'}`}
              >
                <Icon name="person" />
                Atendimento Privado
              </button>
              <button 
                onClick={() => setCategory(AppointmentCategory.CLINIC)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${category === AppointmentCategory.CLINIC ? 'bg-primary text-background-dark shadow-md' : 'text-subtle-light dark:text-subtle-dark hover:bg-primary/10'}`}
              >
                <Icon name="domain" />
                Atendimento em Clínica
              </button>
           </div>
           {category === AppointmentCategory.CLINIC && (
             <p className="mt-3 text-xs text-subtle-light dark:text-subtle-dark italic">
               * Na clínica, você pode atender até 4 pacientes simultaneamente.
             </p>
           )}
        </section>

        {/* Patient Selection */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">Paciente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="md:col-span-1">
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Selecionar Paciente</p>
                <select className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base">
                  <option value="">Busque um paciente</option>
                  <option value="1">Ana Clara Souza</option>
                  <option value="2">Bruno Medeiros</option>
                </select>
              </label>
            </div>
            <div className="md:col-span-1 flex items-center justify-between gap-4 rounded-lg p-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">Vínculo</h3>
                <p className="text-subtle-light dark:text-subtle-dark text-xs font-normal leading-normal">
                  {category === AppointmentCategory.CLINIC ? 'Paciente do convênio da clínica.' : 'Paciente particular direto.'}
                </p>
              </div>
              <div className="flex items-center justify-center size-12 bg-primary/20 rounded-lg text-primary">
                <Icon name={category === AppointmentCategory.CLINIC ? 'domain' : 'person'} className="text-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">Data e Horário</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Data</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base" type="date" />
            </label>
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Hora</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base" type="time" />
            </label>
            {category === AppointmentCategory.CLINIC && (
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Vaga na Clínica</p>
                <select className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 px-4 text-base">
                  <option value="0">Vaga 1 (Livre)</option>
                  <option value="1">Vaga 2 (Livre)</option>
                  <option value="2">Vaga 3 (Ocupada)</option>
                  <option value="3">Vaga 4 (Livre)</option>
                </select>
              </label>
            )}
            {category === AppointmentCategory.PRIVATE && (
                <label className="flex flex-col min-w-40 flex-1">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Status Inicial</p>
                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-subtle-light dark:text-subtle-dark border border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50 h-14 px-4 text-base font-medium cursor-not-allowed" readOnly value="Agendado" />
              </label>
            )}
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4 pb-12">
          <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-lg text-base font-bold text-text-light dark:text-text-dark bg-transparent hover:bg-primary/20 transition-colors" type="button">Cancelar</button>
          <button onClick={() => navigate('/agenda')} className="px-8 py-3 rounded-lg text-base font-bold text-background-dark bg-primary hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20" type="submit">Confirmar Agendamento</button>
        </div>
      </div>
    </div>
  );
};

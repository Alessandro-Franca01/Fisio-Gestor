
import React from 'react';
import { Icon } from '../components/Icon';
import { useNavigate } from 'react-router-dom';

export const AppointmentExecute: React.FC = () => {
  const navigate = useNavigate();

  // Mock de dados de execução (Poderia vir de props ou state)
  const category = "Clínica"; // ou "Privado"

  return (
    <div className="flex flex-col max-w-4xl mx-auto flex-1">
      {/* PageHeading */}
      <div className="flex flex-wrap justify-between gap-3 mb-6">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-text-light dark:text-text-dark text-3xl font-bold leading-tight tracking-tight">Execução do Atendimento</p>
          <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Registre os detalhes e a evolução do paciente.</p>
        </div>
        <div className="flex items-center">
             <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${category === 'Clínica' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'}`}>
                <Icon name={category === 'Clínica' ? 'domain' : 'person'} className="text-sm" />
                Atendimento {category}
             </span>
        </div>
      </div>

      {/* Card */}
      <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-full sm:w-1/3 bg-center bg-no-repeat aspect-video sm:aspect-square bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUQD9uE96PgKKDbUpfn4pKxnPB_U7CNBL5hEQ0L38-Nsq9TC0QNJXPUub4YTsUrWu0DmDIYqQkgheDHqx-p4APn8vu397bgSbKptzbPq4Gy07msp_yqxrrXTYJZKaAYsuEB4rDfIPdOp5Asq5y9FMZZ0N2djK5m8Y7-cOpLQ-9TAPzjpO5PEs9C_ARvzUEBGvD2iO4JOyWKrP2O_HMMGa8-HgUTyob4yuty08rt9SkkSR__HSn6piZ0jjv-gyN7OHdFkVhsEWU0fQ")' }}></div>
          <div className="flex w-full min-w-72 grow flex-col justify-center gap-2 py-2">
            <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal">Informações do Agendamento</p>
            <p className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">Ana Beatriz Costa</p>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal flex items-center gap-2">
                <Icon name="event" /> 15 de Agosto, 2024 - 10:00
              </p>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal flex items-center gap-2">
                <Icon name="check_circle" /> {category === 'Clínica' ? 'Clínica Central - Sala 04' : 'Atendimento Domiciliar'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 pb-20">
        {/* Horário */}
        <div>
          <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight pb-3 border-b border-border-light dark:border-border-dark">Horário do Atendimento</h3>
          <div className="flex flex-wrap items-end gap-4 pt-5">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Início</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base" type="time" defaultValue="10:05" />
            </label>
            <button className="h-12 px-6 bg-primary/20 dark:bg-primary/30 text-text-light dark:text-text-dark rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/30 transition-colors">
              <Icon name="login" /> Check-in
            </button>
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Término</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base" type="time" />
            </label>
            <button className="h-12 px-6 bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-colors">
              <Icon name="logout" /> Check-out
            </button>
          </div>
        </div>

        {/* Evolução */}
        <div>
          <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight pb-3 border-b border-border-light dark:border-border-dark">Evolução Clínica</h3>
          <div className="pt-5">
            <textarea className="form-textarea w-full resize-y rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark min-h-48 p-4 text-base transition-all" placeholder="Descreva os exercícios, feedback do paciente e plano para a próxima sessão..."></textarea>
          </div>
        </div>

        {/* Anexos */}
        <div>
          <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight pb-3 border-b border-border-light dark:border-border-dark">Anexos / Fotos</h3>
          <div className="mt-5 flex justify-center rounded-xl border-2 border-dashed border-border-light dark:border-border-dark px-6 py-10 bg-background-light/30 dark:bg-background-dark/30 hover:bg-primary/5 transition-colors cursor-pointer group">
            <div className="text-center">
              <Icon name="upload_file" className="text-5xl text-subtle-light dark:text-subtle-dark group-hover:text-primary transition-colors" />
              <div className="mt-4 flex text-sm leading-6 text-subtle-light dark:text-subtle-dark">
                <label className="relative cursor-pointer rounded-md font-semibold text-primary hover:underline">
                  <span>Clique aqui para anexar</span>
                  <input type="file" className="sr-only" />
                </label>
                <p className="pl-1">ou arraste o arquivo</p>
              </div>
              <p className="text-xs leading-5 text-subtle-light dark:text-subtle-dark">Imagens ou documentos até 10MB</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-4 mt-10 pt-6 border-t border-border-light dark:border-border-dark">
          <button onClick={() => navigate(-1)} className="h-12 px-6 text-text-light dark:text-text-dark rounded-lg text-sm font-bold hover:bg-primary/10 transition-colors">Cancelar</button>
          <button onClick={() => navigate('/agenda')} className="h-12 px-8 bg-primary text-background-dark rounded-lg text-sm font-black flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-primary/20">
            <Icon name="check_circle" />
            Finalizar Atendimento
          </button>
        </div>
      </div>
    </div>
  );
};

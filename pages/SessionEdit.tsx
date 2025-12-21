import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const SessionEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock initial data - in a real app, this would be fetched based on 'id'
  const [sessionData, setSessionData] = useState({
    patientName: 'Ana Silva',
    totalSessions: 10,
    price: 1500.00,
    startDate: '2024-06-12',
    notes: 'Paciente com lesão ligamentar no joelho direito. Foco em fortalecimento de quadríceps e estabilidade.',
    schedules: [
      { day: 'Segunda-feira', time: '14:00' },
      { day: 'Quarta-feira', time: '14:00' }
    ]
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save changes would go here
    navigate(`/sessions/${id}`);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Editar Sessão</h1>
          <p className="text-subtle-light dark:text-subtle-dark mt-1">Atualize as informações do pacote de tratamento.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => navigate(-1)} 
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark text-sm font-bold border border-border-light dark:border-border-dark hover:bg-primary/10 transition-colors"
          >
            <span className="truncate">Cancelar</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 shadow-sm transition-all"
          >
            <Icon name="check_circle" className="mr-2" />
            <span className="truncate">Salvar Alterações</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Paciente</p>
              <div className="relative">
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-subtle-light dark:text-subtle-dark bg-background-light/50 dark:bg-background-dark/50 border border-border-light dark:border-border-dark h-12 px-4 text-base cursor-not-allowed" 
                  value={sessionData.patientName} 
                  readOnly 
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-4 text-subtle-light dark:text-subtle-dark">
                  <Icon name="lock" className="text-sm" />
                </div>
              </div>
              <p className="text-xs text-subtle-light dark:text-subtle-dark mt-1 italic">* O paciente não pode ser alterado após a criação do pacote.</p>
            </label>
          </div>

          <div>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Número total de atendimentos</p>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all" 
                type="number" 
                value={sessionData.totalSessions}
                onChange={(e) => setSessionData({...sessionData, totalSessions: parseInt(e.target.value)})}
              />
            </label>
          </div>

          <div>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Valor Total do Pacote (R$)</p>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all" 
                value={`R$ ${sessionData.price.toFixed(2)}`}
                onChange={(e) => {
                  const val = parseFloat(e.target.value.replace('R$ ', ''));
                  if(!isNaN(val)) setSessionData({...sessionData, price: val});
                }}
              />
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Data de Início do Tratamento</p>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all" 
                type="date" 
                value={sessionData.startDate}
                onChange={(e) => setSessionData({...sessionData, startDate: e.target.value})}
              />
            </label>
          </div>

          <div className="md:col-span-2">
            <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Horários Fixos (Recorrência)</p>
            <div className="flex flex-col gap-4">
              {sessionData.schedules.map((slot, i) => (
                <div key={i} className="flex items-end gap-4 animate-in fade-in slide-in-from-left-2">
                  <label className="flex flex-col min-w-40 flex-1">
                    <select 
                      className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all" 
                      defaultValue={slot.day}
                    >
                      <option>Segunda-feira</option>
                      <option>Terça-feira</option>
                      <option>Quarta-feira</option>
                      <option>Quinta-feira</option>
                      <option>Sexta-feira</option>
                    </select>
                  </label>
                  <label className="flex flex-col min-w-32 flex-none">
                    <input 
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all" 
                      type="time" 
                      defaultValue={slot.time} 
                    />
                  </label>
                  <button 
                    type="button"
                    className="flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-red-500 hover:bg-red-500/10 transition-colors"
                    onClick={() => {
                       const newScheds = [...sessionData.schedules];
                       newScheds.splice(i, 1);
                       setSessionData({...sessionData, schedules: newScheds});
                    }}
                  >
                    <Icon name="delete" />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-bold hover:bg-primary/20 transition-all border border-dashed border-primary/30"
                onClick={() => setSessionData({...sessionData, schedules: [...sessionData.schedules, { day: 'Segunda-feira', time: '08:00' }]})}
              >
                <Icon name="add" />
                <span className="truncate">Adicionar Novo Horário</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Observações Clínicas / Notas</p>
              <textarea 
                className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark min-h-32 px-4 py-3 text-base transition-all" 
                placeholder="Detalhes sobre o tratamento, objetivos, restrições..."
                value={sessionData.notes}
                onChange={(e) => setSessionData({...sessionData, notes: e.target.value})}
              ></textarea>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4 border-t border-border-light dark:border-border-dark pt-6">
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="px-6 py-2 rounded-lg text-sm font-bold text-text-light dark:text-text-dark bg-transparent hover:bg-primary/10 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="px-8 py-2 rounded-lg text-sm font-bold text-background-dark bg-primary hover:bg-opacity-90 transition-all shadow-md shadow-primary/20"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};
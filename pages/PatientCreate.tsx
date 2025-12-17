import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

export const PatientCreate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
           <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Novo Paciente</h1>
           <p className="text-subtle-light dark:text-subtle-dark mt-1">Preencha as informações para cadastrar um novo paciente.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => navigate(-1)} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/10 transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark">
            <span className="truncate">Cancelar</span>
          </button>
          <button onClick={() => navigate('/patients/1')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-colors shadow-sm">
            <Icon name="check_circle" className="mr-2" />
            <span className="truncate">Salvar Cadastro</span>
          </button>
        </div>
      </header>
      
      <div className="space-y-6">
        {/* Personal Info */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-border-light dark:border-border-dark pb-4">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon name="person_add" />
             </div>
             <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Dados Pessoais</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <label className="flex flex-col md:col-span-2">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Nome Completo</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" placeholder="Ex: Ana Maria Silva" />
            </label>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">CPF</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" placeholder="000.000.000-00" />
            </label>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Data de Nascimento</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" type="date" />
            </label>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Ocupação</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" placeholder="Ex: Designer" />
            </label>
             <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Gênero</p>
              <div className="relative">
                <select className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all">
                    <option value="">Selecione</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-light dark:text-text-dark">
                  <Icon name="chevron_right" className="rotate-90 text-sm" />
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
           <div className="flex items-center gap-3 mb-6 border-b border-border-light dark:border-border-dark pb-4">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon name="group" />
             </div>
             <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Contato e Emergência</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Email</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" type="email" placeholder="email@exemplo.com" />
            </label>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Telefone / WhatsApp</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" placeholder="(00) 00000-0000" />
            </label>
            <div className="md:col-span-2 border-t border-dashed border-border-light dark:border-border-dark my-1"></div>
            <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Nome do Contato de Emergência</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" placeholder="Nome do parente ou amigo" />
            </label>
             <label className="flex flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Telefone de Emergência</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" placeholder="(00) 00000-0000" />
            </label>
          </div>
        </section>

        {/* Address */}
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
           <div className="flex items-center gap-3 mb-6 border-b border-border-light dark:border-border-dark pb-4">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon name="search" />
             </div>
             <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Endereço</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <label className="flex flex-col md:col-span-2">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">CEP</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" placeholder="00000-000" />
            </label>
            <label className="flex flex-col md:col-span-3">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Cidade</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" />
            </label>
            <label className="flex flex-col md:col-span-1">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">UF</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" maxLength={2} />
            </label>

            <label className="flex flex-col md:col-span-4">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Logradouro (Rua, Av, etc)</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" />
            </label>
            <label className="flex flex-col md:col-span-2">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Número</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" />
            </label>

            <label className="flex flex-col md:col-span-3">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Bairro</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" />
            </label>
            <label className="flex flex-col md:col-span-3">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Complemento</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark" placeholder="Apto, Bloco, etc" />
            </label>
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-6 pb-8">
            <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-lg text-base font-bold text-text-light dark:text-text-dark bg-transparent hover:bg-primary/10 transition-colors" type="button">Cancelar</button>
            <button onClick={() => navigate('/patients/1')} className="px-8 py-3 rounded-lg text-base font-bold text-background-dark bg-primary hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/20" type="button">Salvar Paciente</button>
        </div>
      </div>
    </div>
  );
};
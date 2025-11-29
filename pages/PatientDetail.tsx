import React from 'react';
import { Icon } from '../components/Icon';
import { useNavigate } from 'react-router-dom';

export const PatientDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium hover:text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
        <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium">/</span>
        <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium hover:text-primary cursor-pointer" onClick={() => navigate('/patients')}>Pacientes</span>
        <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium">/</span>
        <span className="text-text-light dark:text-text-dark text-sm font-medium">Ana Silva</span>
      </div>

      {/* Header */}
      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div className="flex gap-4">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full flex-shrink-0 h-24 w-24 lg:h-32 lg:w-32" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8Bd-JIXsStruK9ekY2rJqnSb0AL2NhHBrPymAr2A0hXalaaKF9G7nRbpJAqZ994ZgAtLTPSM3X6Qj75fQYJRnks5z6HHxKds-VPh95Tp8PoSiYK9oYhQGwp408Sc1Rm8miBdeuP0pahuDockSQqInUCUchZQxwA5ChL815Ui0frpS48WqzX4tEKwHWVd1K6dOrVj7iv2oVW4gBLwJqneEAYJwfQvK5MLYmbexSFlV0ugilRZvgJpml9tgkJz3WaLB6zD0-OrRX3Q")' }}></div>
          <div className="flex flex-col justify-center">
            <h1 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">Ana Silva</h1>
            <p className="text-primary text-base font-normal leading-normal">Paciente Ativo</p>
            <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Idade: 34 anos</p>
          </div>
        </div>
        <div className="flex w-full flex-col sm:flex-row max-w-[480px] gap-3">
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 dark:bg-primary/20 text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] flex-1 hover:bg-primary/30 transition-colors">
            <span className="truncate">Registrar Pagamento</span>
          </button>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] flex-1 hover:bg-opacity-90 transition-colors">
            <span className="truncate">Ver Atendimentos</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Info */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Informações do Paciente</h3>
              <button className="text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors">
                <Icon name="edit" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-subtle-light dark:text-subtle-dark">CPF</span><span className="font-medium text-text-light dark:text-text-dark">123.456.789-00</span></div>
              <div className="flex justify-between"><span className="text-subtle-light dark:text-subtle-dark">Telefone</span><span className="font-medium text-text-light dark:text-text-dark">(11) 98765-4321</span></div>
              <div className="flex justify-between"><span className="text-subtle-light dark:text-subtle-dark">Email</span><span className="font-medium text-text-light dark:text-text-dark">ana.silva@email.com</span></div>
              <div className="flex justify-between"><span className="text-subtle-light dark:text-subtle-dark">Contato de Emergência</span><span className="font-medium text-text-light dark:text-text-dark">Maria Souza (Mãe)</span></div>
            </div>
          </div>
          {/* Addresses */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Endereços</h3>
              <button className="text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors">
                <Icon name="add_circle" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-b border-border-light dark:border-border-dark pb-4">
                <p className="font-medium text-text-light dark:text-text-dark">Residencial</p>
                <p className="text-subtle-light dark:text-subtle-dark text-sm">Rua das Flores, 123, Apto 45, São Paulo - SP, 01234-567</p>
              </div>
              <div>
                <p className="font-medium text-text-light dark:text-text-dark">Trabalho</p>
                <p className="text-subtle-light dark:text-subtle-dark text-sm">Av. Paulista, 1000, Andar 10, São Paulo - SP, 01310-100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">Total a Pagar</p>
              <p className="text-text-light dark:text-text-dark tracking-light text-2xl font-bold leading-tight">R$ 350,00</p>
            </div>
            <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">Total Pago</p>
              <p className="text-text-light dark:text-text-dark tracking-light text-2xl font-bold leading-tight">R$ 1.200,00</p>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div className="flex border-b border-border-light dark:border-border-dark">
                <button className="px-4 py-2 text-sm font-semibold border-b-2 border-primary text-text-light dark:text-text-dark">Sessões Ativas</button>
                <button className="px-4 py-2 text-sm font-semibold text-subtle-light dark:text-subtle-dark border-b-2 border-transparent hover:border-primary/30">Sessões Concluídas</button>
              </div>
              <button onClick={() => navigate('/sessions/new')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors">
                <Icon name="add" />
                <span className="truncate">Criar Nova Sessão</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-subtle-light dark:text-subtle-dark uppercase tracking-wider text-xs border-b border-border-light dark:border-border-dark">
                  <tr>
                    <th className="py-3 px-4">Sessão</th>
                    <th className="py-3 px-4">Início</th>
                    <th className="py-3 px-4">Frequência</th>
                    <th className="py-3 px-4">Atendimentos</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  <tr className="hover:bg-primary/5">
                    <td className="py-3 px-4 font-medium text-text-light dark:text-text-dark">#58291</td>
                    <td className="py-3 px-4 text-text-light dark:text-text-dark">15/05/2024</td>
                    <td className="py-3 px-4 text-text-light dark:text-text-dark">2x/semana</td>
                    <td className="py-3 px-4 text-text-light dark:text-text-dark">6 de 10</td>
                    <td className="py-3 px-4 text-right"><a className="font-bold text-primary hover:underline cursor-pointer">Ver Detalhes</a></td>
                  </tr>
                  <tr className="hover:bg-primary/5">
                    <td className="py-3 px-4 font-medium text-text-light dark:text-text-dark">#57103</td>
                    <td className="py-3 px-4 text-text-light dark:text-text-dark">02/03/2024</td>
                    <td className="py-3 px-4 text-text-light dark:text-text-dark">1x/semana</td>
                    <td className="py-3 px-4 text-text-light dark:text-text-dark">8 de 8</td>
                    <td className="py-3 px-4 text-right"><a className="font-bold text-primary hover:underline cursor-pointer">Ver Detalhes</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

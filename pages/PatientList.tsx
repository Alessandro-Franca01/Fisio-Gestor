import React from 'react';
import { Icon } from '../components/Icon';
import { useNavigate } from 'react-router-dom';

const patients = [
  { name: 'João da Silva', status: 'Em dia', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoVNHh_7znLCdQuCsAZ5_4gMgxSWQ0yCq3vlkFdDapohyRDFG5YpXhpoFz9t5PZhKM42Vxw_sSP8dzswCmIKzsQgD1X-rJyJ5DrJ6QFUZuMS0aKt2h6bkmHB3uCMWk2YHZZDaNnsvU-4z4MtTHXCRBl69aWS8kSRu6pZFbKOdoRx9fHnY4IiFLhl0-p5140P-vDEuIfwrBfokECRKBEIZnuF6OiZ2ZTPlC3K0ZwNrYO6rdtNMp7Y_P_PH9I1wSLg4FUFvU1gAyLF8' },
  { name: 'Maria Clara Oliveira', status: 'Pendente', initials: 'MC', color: 'bg-orange-200 text-orange-700' },
  { name: 'Carlos Souza', status: 'Atrasado', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmlWC_9HNBhHIm6fRNXXxn-WfcXx_K1luG8MuJBqpbGpyR4XQOwg03EbzI91Q2jpzS-vWtTpjIYAuILFOHi-F72Jgk2Np1-rVs2m3PXfnazUlchaXqRz6evP2C_W1I8q1ekkU6CKxwrdGXbgaEicuksOZcLp3TjA7-S9b25msyo_YARi_hCusBf_0AAkWRDkhnxiyv-lTnLHwFInO_qZy67IqKCLU73bQZILN2X4nw_8y1ofU7rlT962skwuwPJ8AECv4-4K8YAko' }
];

export const PatientList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Lista de Pacientes</h1>
          <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Gerencie seus pacientes e status financeiros.</p>
        </div>
        <button onClick={() => navigate('/patients/new')} className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide shadow-sm hover:opacity-90">
          <Icon name="add" />
          <span className="truncate">Adicionar Paciente</span>
        </button>
      </header>

      <div className="mb-6">
        <label className="flex h-12 w-full flex-col">
          <div className="flex h-full w-full flex-1 items-stretch rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark focus-within:ring-2 focus-within:ring-primary/50">
            <div className="text-subtle-light dark:text-subtle-dark flex items-center justify-center pl-4">
              <Icon name="search" />
            </div>
            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-subtle-light dark:placeholder:text-subtle-dark px-2 text-base font-normal leading-normal" placeholder="Buscar por nome..." />
          </div>
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <table className="w-full">
          <thead className="border-b border-border-light dark:border-border-dark">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-subtle-light dark:text-subtle-dark">Paciente</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-subtle-light dark:text-subtle-dark">Status Financeiro</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-subtle-light dark:text-subtle-dark"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={i} className="border-b border-border-light dark:border-border-dark hover:bg-primary/5 cursor-pointer" onClick={() => navigate('/patients/1')}>
                <td className="h-20 px-6 py-2">
                  <div className="flex items-center gap-4">
                    {p.img ? (
                      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: `url("${p.img}")` }}></div>
                    ) : (
                      <div className={`flex items-center justify-center font-bold rounded-full size-10 ${p.color}`}>
                        <span>{p.initials}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-text-light dark:text-text-dark">{p.name}</span>
                  </div>
                </td>
                <td className="h-20 px-6 py-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                    ${p.status === 'Em dia' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : ''}
                    ${p.status === 'Pendente' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' : ''}
                    ${p.status === 'Atrasado' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : ''}
                  `}>
                    {p.status}
                  </span>
                </td>
                <td className="h-20 px-6 py-2 text-right">
                  <span className="text-sm font-bold text-primary hover:underline">Ver Perfil</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

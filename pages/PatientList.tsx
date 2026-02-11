import React, { useEffect, useState, useRef } from 'react';
import { Icon } from '../components/Icon';
import { useNavigate } from 'react-router-dom';
import { getPatients, PaginatedResponse, Patient } from '../services/patientService';

export const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Patient> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(1);
  const debounceRef = useRef<number | null>(null);

  const loadPatients = async (pageToLoad = 1, searchQuery = search) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { page: pageToLoad, ...(searchQuery ? { search: searchQuery } : {}) };
      const response = await getPatients(params);
      setPatients(response.data || []);
      setPagination(response);
      setPage(pageToLoad);
    } catch (err: any) {
      console.error('Failed to load patients:', err);
      setError('Erro ao carregar pacientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    loadPatients();
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // debounce search
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setPage(1);
      loadPatients(1, search);
    }, 300) as unknown as number;

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-subtle-light dark:placeholder:text-subtle-dark px-2 text-base font-normal leading-normal" placeholder="Buscar por nome ou telefone..." />
          </div>
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        {isLoading ? (
          <div className="p-8 text-center">Carregando pacientes...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center">Nenhum paciente encontrado.</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-subtle-light dark:text-subtle-dark">Paciente</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-subtle-light dark:text-subtle-dark">RG</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-subtle-light dark:text-subtle-dark">Idade</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-subtle-light dark:text-subtle-dark">Status Financeiro</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-subtle-light dark:text-subtle-dark"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b border-border-light dark:border-border-dark hover:bg-primary/5 cursor-pointer" onClick={() => navigate(`/patients/${p.id}`)}>
                  <td className="h-20 px-6 py-2">
                    <div className="flex items-center gap-4">
                      {p.avatar_url || p.img ? (
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: `url("${p.avatar_url ?? p.img}")` }}></div>
                      ) : (
                        <div className={`flex items-center justify-center font-bold rounded-full size-10 bg-gray-200 text-gray-700`}>
                          <span>{(p.name || '').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}</span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-text-light dark:text-text-dark">{p.name}</span>
                    </div>
                  </td>
                  <td className="h-20 px-6 py-2">
                    <span className="text-sm text-text-light dark:text-text-dark">{p.rg || '—'}</span>
                  </td>
                  <td className="h-20 px-6 py-2">
                    <span className="text-sm text-text-light dark:text-text-dark">{p.age ? `${p.age} anos` : '—'}</span>
                  </td>
                  <td className="h-20 px-6 py-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold`}>{p.financial_status ?? p.status ?? '—'}</span>
                  </td>
                  <td className="h-20 px-6 py-2 text-right">
                    <span className="text-sm font-bold text-primary hover:underline">Ver Perfil</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 sm:px-6 mt-4 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => loadPatients(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => loadPatients(page + 1)}
              disabled={page === pagination.last_page}
              className="relative ml-3 inline-flex items-center rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-subtle-light dark:text-subtle-dark">
                Mostrando <span className="font-medium">{pagination.from}</span> até <span className="font-medium">{pagination.to}</span> de{' '}
                <span className="font-medium">{pagination.total}</span> resultados
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => loadPatients(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-subtle-light dark:text-subtle-dark ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  <Icon name="chevron_left" className="h-5 w-5" />
                </button>
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => loadPatients(p)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${p === page
                      ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      : 'text-text-light dark:text-text-dark ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0'
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => loadPatients(page + 1)}
                  disabled={page === pagination.last_page}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-subtle-light dark:text-subtle-dark ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Próximo</span>
                  <Icon name="chevron_right" className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

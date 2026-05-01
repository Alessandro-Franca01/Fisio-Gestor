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
  const [perPage, setPerPage] = useState(10);
  const debounceRef = useRef<number | null>(null);

  const loadPatients = async (pageToLoad = 1, searchQuery = search, limit = perPage) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { 
        page: pageToLoad, 
        per_page: limit,
        ...(searchQuery ? { search: searchQuery } : {}) 
      };
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
      loadPatients(1, search, perPage);
    }, 300) as unknown as number;

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    loadPatients(1, search, perPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

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
      {pagination && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-4 sm:px-6 mt-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <p className="text-sm text-subtle-light dark:text-subtle-dark">
              Mostrando <span className="font-semibold text-text-light dark:text-text-dark">{pagination.from || 0}</span> até <span className="font-semibold text-text-light dark:text-text-dark">{pagination.to || 0}</span> de{' '}
              <span className="font-semibold text-text-light dark:text-text-dark">{pagination.total}</span> pacientes
            </p>
            <div className="hidden sm:block h-4 w-px bg-border-light dark:bg-border-dark"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-subtle-light dark:text-subtle-dark">Por página:</span>
              <select 
                value={perPage} 
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="bg-transparent border border-border-light dark:border-border-dark rounded px-2 py-1 text-sm text-text-light dark:text-text-dark focus:ring-1 focus:ring-primary outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          
          <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
            <button
              onClick={() => loadPatients(page - 1)}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-light dark:border-border-dark text-subtle-light dark:text-subtle-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
              title="Anterior"
            >
              <Icon name="chevron_left" className="text-xl" />
            </button>

            <div className="flex items-center gap-1">
              {(() => {
                const totalPages = pagination.last_page;
                const current = page;
                const delta = 1;
                const range = [];
                const rangeWithDots = [];
                let l;

                for (let i = 1; i <= totalPages; i++) {
                  if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
                    range.push(i);
                  }
                }

                for (const i of range) {
                  if (l) {
                    if (i - l === 2) {
                      rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                      rangeWithDots.push('...');
                    }
                  }
                  rangeWithDots.push(i);
                  l = i;
                }

                return rangeWithDots.map((p, index) => (
                  p === '...' ? (
                    <span key={`dots-${index}`} className="px-2 text-subtle-light dark:text-subtle-dark">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => loadPatients(Number(p))}
                      className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg px-2 text-sm font-bold transition-all ${
                        p === page
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-border-light dark:hover:border-border-dark'
                      }`}
                    >
                      {p}
                    </button>
                  )
                ));
              })()}
            </div>

            <button
              onClick={() => loadPatients(page + 1)}
              disabled={page === pagination.last_page}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-light dark:border-border-dark text-subtle-light dark:text-subtle-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
              title="Próximo"
            >
              <Icon name="chevron_right" className="text-xl" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

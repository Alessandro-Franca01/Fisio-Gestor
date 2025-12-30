import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { useNavigate, useParams } from 'react-router-dom';
import patientService, { Patient } from '../services/patientService';

export const PatientDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionFilter, setSessionFilter] = useState<'Ativa' | 'Concluída'>('Ativa');

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await patientService.getPatientById(id);
        setPatient(data);
      } catch (error) {
        console.error('Failed to fetch patient details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-subtle-light dark:text-subtle-dark">Carregando detalhes do paciente...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-subtle-light dark:text-subtle-dark">Paciente não encontrado.</p>
        <button onClick={() => navigate('/patients')} className="text-primary font-bold hover:underline">Voltar para a lista</button>
      </div>
    );
  }

  const filteredSessions = patient.sessions?.filter(s => s.status === sessionFilter) || [];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium hover:text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
        <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium">/</span>
        <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium hover:text-primary cursor-pointer" onClick={() => navigate('/patients')}>Pacientes</span>
        <span className="text-subtle-light dark:text-subtle-dark text-sm font-medium">/</span>
        <span className="text-text-light dark:text-text-dark text-sm font-medium">{patient.name}</span>
      </div>

      {/* Header */}
      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div className="flex gap-4">
          <div className="flex items-center justify-center font-bold rounded-full size-24 lg:size-32 bg-primary/10 text-primary text-4xl">
            {patient.name.charAt(0)}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">{patient.name}</h1>
            <p className="text-primary text-base font-normal leading-normal">{patient.status || 'Ativo'}</p>
            {patient.age && <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Idade: {patient.age} anos</p>}
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
              <button
                onClick={() => navigate(`/patients/${patient.id}/edit`)}
                className="text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors"
              >
                <Icon name="edit" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-subtle-light dark:text-subtle-dark">CPF</span><span className="font-medium text-text-light dark:text-text-dark">{patient.cpf || '-'}</span></div>
              <div className="flex justify-between"><span className="text-subtle-light dark:text-subtle-dark">RG</span><span className="font-medium text-text-light dark:text-text-dark">{patient.rg || '-'}</span></div>
              <div className="flex justify-between"><span className="text-subtle-light dark:text-subtle-dark">Telefone</span><span className="font-medium text-text-light dark:text-text-dark">{patient.phone || '-'}</span></div>
              <div className="flex justify-between"><span className="text-subtle-light dark:text-subtle-dark">Email</span><span className="font-medium text-text-light dark:text-text-dark text-xs">{patient.email || '-'}</span></div>
              <div className="flex justify-between"><span className="text-subtle-light dark:text-subtle-dark">Contato de Emergência</span><span className="font-medium text-text-light dark:text-text-dark text-right">{patient.emergency_contact_name || '-'} {patient.emergency_contact_phone && `(${patient.emergency_contact_phone})`}</span></div>
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
              {patient.addresses && patient.addresses.length > 0 ? (
                patient.addresses.map((addr) => (
                  <div key={addr.id} className="border-b last:border-0 border-border-light dark:border-border-dark pb-4 last:pb-0">
                    <p className="font-medium text-text-light dark:text-text-dark">{addr.type}</p>
                    <p className="text-subtle-light dark:text-subtle-dark text-sm">
                      {addr.street}, {addr.number}{addr.complement && `, ${addr.complement}`}<br />
                      {addr.neighborhood}, {addr.city} - {addr.state}, {addr.zip_code}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-subtle-light dark:text-subtle-dark text-sm">Nenhum endereço cadastrado.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">Total Pago</p>
              <p className="text-green-600 dark:text-green-400 tracking-light text-2xl font-bold leading-tight">R$ {(patient.total_paid || 0).toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">Total Restante</p>
              <p className="text-red-500 tracking-light text-2xl font-bold leading-tight">R$ {(patient.total_to_pay || 0).toFixed(2).replace('.', ',')}</p>
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div className="flex border-b border-border-light dark:border-border-dark">
                <button
                  onClick={() => setSessionFilter('Ativa')}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${sessionFilter === 'Ativa' ? 'border-primary text-text-light dark:text-text-dark' : 'border-transparent text-subtle-light dark:text-subtle-dark hover:border-primary/30'}`}
                >
                  Sessões Ativas
                </button>
                <button
                  onClick={() => setSessionFilter('Concluída')}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${sessionFilter === 'Concluída' ? 'border-primary text-text-light dark:text-text-dark' : 'border-transparent text-subtle-light dark:text-subtle-dark hover:border-primary/30'}`}
                >
                  Sessões Concluídas
                </button>
              </div>
              <button
                onClick={() => navigate('/sessions/new')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
              >
                <Icon name="add" />
                <span className="truncate">Nova Sessão</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-subtle-light dark:text-subtle-dark uppercase tracking-wider text-xs border-b border-border-light dark:border-border-dark">
                  <tr>
                    <th className="py-3 px-4">Título</th>
                    <th className="py-3 px-4">Início</th>
                    <th className="py-3 px-4">Frequência</th>
                    <th className="py-3 px-4">Atendimentos</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-primary/5 transition-colors">
                        <td className="py-3 px-4 font-medium text-text-light dark:text-text-dark">{session.title || `#${session.id}`}</td>
                        <td className="py-3 px-4 text-text-light dark:text-text-dark">{new Date(session.start_date.substring(0, 10) + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-4 text-text-light dark:text-text-dark font-medium text-xs">
                          {session.schedules?.map(s => s.day_of_week.substring(0, 3)).join(', ')}
                        </td>
                        <td className="py-3 px-4 text-text-light dark:text-text-dark">{session.completed_appointments_count || 0} de {session.total_appointments}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => navigate(`/sessions/${session.id}`)}
                            className="font-bold text-primary hover:underline cursor-pointer"
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-subtle-light dark:text-subtle-dark">
                        Nenhuma sessão encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


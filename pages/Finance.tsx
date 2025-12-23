import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import paymentService, { Payment } from '../services/paymentService';
import { getPatients } from '../services/patientService';

import { getSessions, Session } from '../services/sessionService';
import { getAppointmentsByPatient, Appointment } from '../services/appointmentService';

export const Finance: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [patientSessions, setPatientSessions] = useState<Session[]>([]);
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedPatient, setSelectedPatient] = useState('');

  const [selectedSession, setSelectedSession] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [status, setStatus] = useState('Pago');
  const [notes, setNotes] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalPending, setTotalPending] = useState(0);


  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const [paymentsData, patientsData] = await Promise.all([
        paymentService.getPayments({ page }),
        getPatients()
      ]);

      if (paymentsData && paymentsData.data) {
        setPayments(paymentsData.data);
        setCurrentPage(paymentsData.current_page);
        setLastPage(paymentsData.last_page);
        setTotalRecords(paymentsData.total);
        setTotalCollected(paymentsData.total_collected || 0);
        setTotalPending(paymentsData.total_pending || 0);
      } else {
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      }

      setPatients(patientsData);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados financeiros.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      fetchData(page);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const sessionIsNull = true;
    const fetchPatientData = async () => {
      if (!selectedPatient) {
        setPatientSessions([]);
        setPatientAppointments([]);
        setSelectedSession('');
        setSelectedAppointment('');
        return;
      }

      setLoadingSessions(true);
      setLoadingAppointments(true);

      try {
        const [sessionsData, appointmentsData] = await Promise.all([
          getSessions({ patient_id: selectedPatient, status: 'Ativa' }),
          getAppointmentsByPatient(selectedPatient, {
            status: 'Pendente',
            sessionIsNull: sessionIsNull ? true : undefined
          }) // Fetch pending appointments
        ]);

        setPatientSessions(sessionsData.data || sessionsData);
        setPatientAppointments(appointmentsData);
      } catch (err) {
        console.error('Error fetching patient data:', err);
      } finally {
        setLoadingSessions(false);
        setLoadingAppointments(false);
      }
    };

    fetchPatientData();
  }, [selectedPatient]);

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !amount) {
      alert('Preencha os campos obrigatórios (Paciente e Valor).');
      return;
    }

    if (selectedSession && selectedAppointment) {
      alert('Não é possível vincular um pagamento a uma sessão e a um atendimento ao mesmo tempo. Selecione apenas um.');
      return;
    }

    try {
      const payload: Partial<Payment> = {
        patient_id: Number(selectedPatient),
        session_id: selectedSession ? Number(selectedSession) : undefined,
        appointment_id: selectedAppointment ? Number(selectedAppointment) : undefined,
        amount: parseFloat(amount.replace(',', '.')),
        payment_date: new Date().toISOString().split('T')[0], // Today
        payment_method: paymentMethod as any,
        status: status as any,
        notes
      };

      await paymentService.createPayment(payload);
      alert(`Pagamento de ${formatCurrency(amount.replace(',', '.'))} registrado com sucesso!`);

      // Reset form
      setSelectedPatient('');
      setSelectedSession('');
      setSelectedAppointment('');
      setAmount('');
      setNotes('');

      // Refresh list
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar pagamento.');
    }
  };

  const handleDeletePayment = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este pagamento?')) {
      try {
        await paymentService.deletePayment(id);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir pagamento.');
      }
    }
  };

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    // Adjust for timezone offset to display the date correctly as stored (simple approach)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return new Intl.DateTimeFormat('pt-BR').format(adjustedDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      case 'Pendente': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
      case 'Atrasado': return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  // Calculate totals - Now using values from API
  const displayTotalCollected = totalCollected;
  const displayPendingPayments = totalPending;

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap justify-between gap-3 pb-6">
        <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Financeiro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <p className="text-subtle-light dark:text-subtle-dark text-base font-medium leading-normal">Total Arrecadado (Geral)</p>
          <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">{formatCurrency(displayTotalCollected)}</p>
          {/* <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">+5.2%</p> */}
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <p className="text-subtle-light dark:text-subtle-dark text-base font-medium leading-normal">Pagamentos Pendentes</p>
          <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">{formatCurrency(displayPendingPayments)}</p>
          {/* <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium leading-normal">+10%</p> */}
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <p className="text-subtle-light dark:text-subtle-dark text-base font-medium leading-normal">Faturamento Médio por Sessão</p>
          <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">R$ 0,00</p>
          <p className="text-subtle-light dark:text-subtle-dark text-sm font-medium leading-normal">(Em breve)</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Registrar Novo Pagamento</h2>
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
          <form onSubmit={handleRegisterPayment} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <label className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Paciente</p>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-3 text-base"
              >
                <option value="">Selecione um paciente</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Sessão (Opcional)</p>
              <select
                value={selectedSession}
                onChange={(e) => {
                  setSelectedSession(e.target.value);
                  if (e.target.value) setSelectedAppointment(''); // Clear appointment if session is selected
                }}
                disabled={!selectedPatient || loadingSessions}
                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-3 text-base disabled:opacity-50"
              >
                <option value="">{loadingSessions ? 'Carregando...' : 'Selecione uma sessão'}</option>
                {patientSessions.map(session => (
                  <option key={session.id} value={session.id}>
                    {session.title || `Sessão #${session.id}`}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Atendimento (Opcional)</p>
              <select
                value={selectedAppointment}
                onChange={(e) => {
                  setSelectedAppointment(e.target.value);
                  if (e.target.value) setSelectedSession(''); // Clear session if appointment is selected
                }}
                disabled={!selectedPatient || loadingAppointments}
                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-3 text-base disabled:opacity-50"
              >
                <option value="">{loadingAppointments ? 'Carregando...' : 'Selecione um atendimento'}</option>
                {patientAppointments.map(appt => (
                  <option key={appt.id} value={appt.id}>
                    {appt.type} - {formatDate(appt.date)} {appt.scheduled_time}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Valor</p>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 p-3 text-base"
                placeholder="0.00"
                type="number"
                step="0.01"
              />
            </label>
            <div className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Forma de Pagamento</p>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-3 text-base"
              >
                <option value="Pix">Pix</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartao">Cartão</option>
                <option value="Debito">Débito</option>
                <option value="Gratuito">Gratuito</option>
              </select>
            </div>
            <div className="flex flex-col col-span-1">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Status</p>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-3 text-base"
              >
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="Atrasado">Atrasado</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Acao_Social">Ação Social</option>
              </select>
            </div>
            <label className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2">Observações</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-3 text-base"
                placeholder="Adicione uma nota..."
              ></textarea>
            </label>
            <div className="flex items-end col-span-1">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary h-12 px-6 text-base font-bold text-background-dark hover:bg-opacity-90 transition-colors" type="submit">
                Registrar Pagamento
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Histórico de Pagamentos</h2>
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background-light dark:bg-background-dark">
                <tr>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Data</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Paciente</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Valor</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Forma Pagamento</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark">Status</th>
                  <th className="p-4 text-sm font-semibold text-subtle-light dark:text-subtle-dark text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">Carregando...</td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">Nenhum pagamento registrado.</td>
                  </tr>
                ) : (
                  payments.map((item) => (
                    <tr key={item.id}>
                      <td className="p-4 text-sm text-text-light dark:text-text-dark">{formatDate(item.payment_date)}</td>
                      <td className="p-4 text-sm text-text-light dark:text-text-dark font-medium">{item.patient?.name || 'Cliente Removido'}</td>
                      <td className="p-4 text-sm text-text-light dark:text-text-dark">{formatCurrency(item.amount)}</td>
                      <td className="p-4 text-sm text-text-light dark:text-text-dark">{item.payment_method}</td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-text-light dark:text-text-dark flex justify-end gap-2">
                        <button className="p-2 rounded-md hover:bg-primary/10"><Icon name="edit" className="text-base" /></button>
                        <button onClick={() => handleDeletePayment(item.id)} className="p-2 rounded-md hover:bg-primary/10"><Icon name="delete" className="text-base" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {lastPage > 1 && (
            <div className="flex items-center justify-between border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-primary/10 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage}
                  className="relative ml-3 inline-flex items-center rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-primary/10 disabled:opacity-50"
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    Mostrando <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(currentPage * 10, totalRecords)}</span> de{' '}
                    <span className="font-medium">{totalRecords}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-subtle-light dark:text-subtle-dark ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-primary/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Anterior</span>
                      <Icon name="chevron_left" className="h-5 w-5" />
                    </button>
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                      let pageNum;
                      if (lastPage <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= lastPage - 2) {
                        pageNum = lastPage - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${currentPage === pageNum
                            ? 'z-10 bg-primary text-background-dark border-primary'
                            : 'text-text-light dark:text-text-dark ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-primary/10'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === lastPage}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-subtle-light dark:text-subtle-dark ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-primary/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
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
      </div>
    </div>
  );
};

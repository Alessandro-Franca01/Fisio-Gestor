import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { createPatient } from '../services/patientService';

// Custom InputMask component
const InputMask = ({
                     mask,
                     value,
                     onChange,
                     onBlur,
                     placeholder,
                     className,
                     type = 'text'
                   }: {
  mask: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}) => {
  const formatValue = (val: string, mask: string): string => {
    if (!val) return '';

    const digits = val.replace(/\D/g, '').split('');
    let result = '';
    let digitIndex = 0;

    for (let i = 0; i < mask.length; i++) {
      if (digitIndex >= digits.length) break;

      if (mask[i] === '9') {
        result += digits[digitIndex] || '';
        digitIndex++;
      } else {
        result += mask[i];
      }
    }

    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    onChange(rawValue);
  };

  const displayValue = formatValue(value, mask);

  return (
      <input
          type={type}
          value={displayValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={className}
      />
  );
};

export const PatientCreate: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState(''); // CORREÇÃO: Adicionado estado faltante
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneMask, setPhoneMask] = useState('(99) 99999-9999');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [cep, setCep] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) return setError('Nome é obrigatório');
    if (!phone.trim()) return setError('Telefone é obrigatório');

    // Formatar data de nascimento para o padrão YYYY-MM-DD
    let formattedBirthDate = null;
    if (birthDate) {
      formattedBirthDate = birthDate;
      // Se já não estiver no formato correto, converter
      if (birthDate.includes('/')) {
        const [day, month, year] = birthDate.split('/');
        formattedBirthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    const payload: any = {
      name: name.trim(),
      email: email || null,
      phone: phone || null,
      cpf: cpf || null,
      birth_date: formattedBirthDate, // CORREÇÃO: Usar a variável correta
      emergency_contact_name: emergencyName || null,
      emergency_contact_phone: emergencyPhone || null,
      notes: occupation || null,
      gender: gender || null, // CORREÇÃO: Adicionar gênero ao payload
    };

    // Only include addresses if at least one field is filled
    const hasAddress = cep || city || state || street || number || neighborhood || complement;
    if (hasAddress) {
      payload.addresses = [{
        cep: cep || '',
        city: city || '',
        state: state || '',
        street: street || '',
        number: number || '',
        neighborhood: neighborhood || '',
        complement: complement || '',
      }];
    }

    try {
      setIsSubmitting(true);
      console.log('Creating patient with payload:', payload);
      const response = await createPatient(payload);
      console.log('Patient created successfully:', response);

      // Extract the patient ID from the response
      const patientId = response?.id || response?.data?.id;

      if (patientId) {
        // Show success message and redirect
        alert('Paciente cadastrado com sucesso!');
        navigate(`/patients/${patientId}`);
      } else {
        console.error('No patient ID in response:', response);
        setError('Erro ao obter ID do paciente. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Failed to create patient:', err);

      if (err?.response?.status === 422) {
        // Handle validation errors
        const errorMessages = [];

        // Handle Laravel validation errors
        if (err.response.data?.errors) {
          for (const [field, messages] of Object.entries(err.response.data.errors)) {
            errorMessages.push(...(messages as string[]));
          }
        }
        // Handle other error formats
        else if (err.response.data?.message) {
          errorMessages.push(err.response.data.message);
        } else {
          errorMessages.push('Erro de validação ao salvar o paciente');
        }

        setError(errorMessages.join('\n'));
      } else if (err?.message) {
        setError(`Erro: ${err.message}`);
      } else {
        setError('Erro ao salvar paciente. Verifique os dados e tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    // Busca o endereço pelo CEP usando a API ViaCEP
    const cepValue = e.target.value.replace(/\D/g, '');
    if (cepValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.state || '');
        } else {
          setError('CEP não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setError('Erro ao buscar CEP. Verifique o número e tente novamente.');
      }
    }
  };

  return (
      <div className="max-w-4xl mx-auto p-4">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Novo Paciente</h1>
            <p className="text-subtle-light dark:text-subtle-dark mt-1">Preencha as informações para cadastrar um novo paciente.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/10 transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark">
              <span className="truncate">Cancelar</span>
            </button>
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-colors shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Icon name="check_circle" className="mr-2" />
              <span className="truncate">{isSubmitting ? 'Salvando...' : 'Salvar Cadastro'}</span>
            </button>
          </div>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="error" className="text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="text-red-800 dark:text-red-300 font-medium">Erro ao cadastrar paciente</p>
                  <p className="text-red-700 dark:text-red-400 text-sm mt-1 whitespace-pre-line">{error}</p>
                </div>
              </div>
            </div>
        )}

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
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Nome Completo <span className="text-red-500">*</span></p>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    placeholder="Ex: Ana Maria Silva"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">CPF</p>
                <InputMask
                    mask="999.999.999-99"
                    value={cpf}
                    onChange={(value: string) => setCpf(value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    placeholder="000.000.000-00"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Data de Nascimento</p>
                <input
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    type="date"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Ocupação</p>
                <input
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    placeholder="Ex: Designer"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Gênero</p>
                <div className="relative">
                  <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all"
                  >
                    <option value="">Selecione</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                    <option value="Prefiro não informar">Prefiro não informar</option>
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
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    type="email"
                    placeholder="email@exemplo.com"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Telefone / WhatsApp <span className="text-red-500">*</span></p>
                <InputMask
                    mask={phoneMask}
                    value={phone}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPhoneMask(value.length > 10 ? '(99) 99999-9999' : '(99) 9999-9999');
                    }}
                    onChange={(value: string) => setPhone(value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    placeholder="(00) 00000-0000"
                />
              </label>
              <div className="md:col-span-2 border-t border-dashed border-border-light dark:border-border-dark my-4 pt-4">
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Contato de Emergência</h3>
              </div>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Nome do Contato</p>
                <input
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    placeholder="Nome do parente ou amigo"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Telefone de Emergência</p>
                <InputMask
                    mask="(99) 99999-9999"
                    value={emergencyPhone}
                    onChange={(value: string) => setEmergencyPhone(value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    placeholder="(00) 00000-0000"
                />
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
                <InputMask
                    mask="99999-999"
                    value={cep}
                    onChange={(value: string) => setCep(value)}
                    onBlur={handleCepBlur}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    placeholder="00000-000"
                />
              </label>
              <label className="flex flex-col md:col-span-3">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Cidade</p>
                <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                />
              </label>
              <label className="flex flex-col md:col-span-1">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">UF</p>
                <input
                    value={state}
                    onChange={e => setState(e.target.value.toUpperCase())}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    maxLength={2}
                />
              </label>

              <label className="flex flex-col md:col-span-4">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Logradouro (Rua, Av, etc)</p>
                <input
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                />
              </label>
              <label className="flex flex-col md:col-span-2">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Número</p>
                <input
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                />
              </label>

              <label className="flex flex-col md:col-span-3">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Bairro</p>
                <input
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                />
              </label>
              <label className="flex flex-col md:col-span-3">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Complemento</p>
                <input
                    value={complement}
                    onChange={e => setComplement(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-4 text-base transition-all placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                    placeholder="Apto, Bloco, etc"
                />
              </label>
            </div>
          </section>

          <div className="flex justify-end gap-4 pt-6 pb-8 border-t border-border-light dark:border-border-dark">
            <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-lg text-base font-bold text-text-light dark:text-text-dark bg-transparent hover:bg-primary/10 transition-colors border border-border-light dark:border-border-dark"
                type="button"
            >
              Cancelar
            </button>
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg text-base font-bold text-background-dark bg-primary hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                type="button"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Paciente'}
            </button>
          </div>
        </div>
      </div>
  );
};
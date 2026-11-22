import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import {
  ErrorAlert,
  FormSection,
  MaskedField,
  SelectField,
  SuccessAlert,
  TextAreaField,
  TextField,
} from '../components/form';
import { createPatient, updatePatient, getPatientById } from '../services/patientService';

interface PatientForm {
  name: string;
  cpf: string;
  rg: string;
  age: string;
  birthDate: string;
  occupation: string;
  gender: string;
  email: string;
  phone: string;
  notes: string;
  emergencyName: string;
  emergencyPhone: string;
  cep: string;
  city: string;
  state: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
}

const emptyForm: PatientForm = {
  name: '',
  cpf: '',
  rg: '',
  age: '',
  birthDate: '',
  occupation: '',
  gender: '',
  email: '',
  phone: '',
  notes: '',
  emergencyName: '',
  emergencyPhone: '',
  cep: '',
  city: '',
  state: '',
  street: '',
  number: '',
  neighborhood: '',
  complement: '',
};

const GENDER_OPTIONS = ['Feminino', 'Masculino', 'Outro', 'Prefiro não informar'].map(v => ({ value: v, label: v }));

const normalizeBirthDate = (value: string): string | null => {
  if (!value) return null;
  if (!value.includes('/')) return value;
  const [day, month, year] = value.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const buildPayload = (f: PatientForm) => {
  const payload: Record<string, any> = {
    name: f.name.trim(),
    email: f.email || null,
    phone: f.phone || null,
    cpf: f.cpf || null,
    rg: f.rg || null,
    age: f.age || null,
    birth_date: normalizeBirthDate(f.birthDate),
    emergency_contact_name: f.emergencyName || null,
    emergency_contact_phone: f.emergencyPhone || null,
    occupation: f.occupation || null,
    notes: f.notes || null,
    gender: f.gender || null,
  };

  const hasAddress = [f.cep, f.city, f.state, f.street, f.number, f.neighborhood, f.complement].some(Boolean);
  if (hasAddress) {
    payload.addresses = [
      {
        cep: f.cep,
        city: f.city,
        state: f.state,
        street: f.street,
        number: f.number,
        neighborhood: f.neighborhood,
        complement: f.complement,
      },
    ];
  }
  return payload;
};

const extractErrorMessage = (err: any): string => {
  if (err?.response?.status === 422) {
    const data = err.response.data;
    if (data?.errors) return Object.values(data.errors).flat().join('\n');
    return data?.message || 'Erro de validação ao salvar o paciente';
  }
  if (err?.message) return `Erro: ${err.message}`;
  return 'Erro ao salvar paciente. Verifique os dados e tente novamente.';
};

export const PatientCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<PatientForm>(emptyForm);
  const [phoneMask, setPhoneMask] = useState('(99) 99999-9999');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const set = <K extends keyof PatientForm>(key: K) => (value: PatientForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const p = await getPatientById(id);
        const addr = p.addresses?.[0];
        setForm({
          name: p.name || '',
          cpf: p.cpf || '',
          rg: p.rg || '',
          age: p.age?.toString() || '',
          birthDate: p.birth_date || '',
          occupation: p.occupation || '',
          gender: p.gender || '',
          email: p.email || '',
          phone: p.phone || '',
          notes: p.notes || '',
          emergencyName: p.emergency_contact_name || '',
          emergencyPhone: p.emergency_contact_phone || '',
          cep: addr?.cep || '',
          city: addr?.city || '',
          state: addr?.state || '',
          street: addr?.street || '',
          number: addr?.number || '',
          neighborhood: addr?.neighborhood || '',
          complement: addr?.complement || '',
        });
        if (p.phone && p.phone.replace(/\D/g, '').length <= 10) {
          setPhoneMask('(99) 9999-9999');
        }
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Erro ao carregar dados do paciente.');
      }
    })();
  }, [id]);

  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!form.name.trim()) return setError('Nome é obrigatório');
    if (!form.phone.trim()) return setError('Telefone é obrigatório');

    const payload = buildPayload(form);

    try {
      setIsSubmitting(true);
      let response;
      if (isEdit && id) {
        response = await updatePatient(id, payload);
        setSuccessMessage('Paciente atualizado com sucesso!');
      } else {
        response = await createPatient(payload);
        setSuccessMessage('Paciente cadastrado com sucesso!');
      }

      const patientId = response?.id || response?.data?.id || id;
      if (patientId) {
        setTimeout(() => navigate(`/patients/${patientId}`), 1500);
      } else {
        setError('Erro ao obter ID do paciente. Tente novamente.');
        setSuccessMessage(null);
      }
    } catch (err: any) {
      console.error('Failed to save patient:', err);
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Busca o endereço pelo CEP usando a API ViaCEP
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cepValue = e.target.value.replace(/\D/g, '');
    if (cepValue.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data = await response.json();
      if (data.erro) {
        setError('CEP não encontrado');
        return;
      }
      setForm(prev => ({
        ...prev,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      }));
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      setError('Erro ao buscar CEP. Verifique o número e tente novamente.');
    }
  };

  const cancelButtonClass =
    'px-6 py-3 rounded-lg text-base font-bold text-text-light dark:text-text-dark bg-transparent hover:bg-primary/10 transition-colors border border-border-light dark:border-border-dark';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
            {isEdit ? 'Editar Paciente' : 'Novo Paciente'}
          </h1>
          <p className="text-subtle-light dark:text-subtle-dark mt-1">
            {isEdit ? 'Atualize as informações do paciente.' : 'Preencha as informações para cadastrar um novo paciente.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/10 transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark"
          >
            <span className="truncate">Cancelar</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-colors shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Icon name="check_circle" />
            <span className="truncate">{isSubmitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Salvar Cadastro'}</span>
          </button>
        </div>
      </header>

      {error && <ErrorAlert title={isEdit ? 'Erro ao atualizar paciente' : 'Erro ao cadastrar paciente'} message={error} />}
      {successMessage && <SuccessAlert message={successMessage} hint="Redirecionando..." />}

      <div className="space-y-6">
        <FormSection icon="person_add" title="Dados Pessoais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Nome Completo" required className="md:col-span-2" value={form.name} onChange={set('name')} placeholder="Ex: Ana Maria Silva" />
            <MaskedField label="CPF" mask="999.999.999-99" value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" />
            <TextField label="RG" value={form.rg} onChange={set('rg')} placeholder="00.000.000-0" />
            <TextField label="Data de Nascimento" type="date" value={form.birthDate} onChange={set('birthDate')} />
            <TextField label="Idade" type="number" value={form.age} onChange={set('age')} placeholder="Ex: 25" />
            <TextField label="Ocupação" value={form.occupation} onChange={set('occupation')} placeholder="Ex: Designer" />
            <SelectField label="Gênero" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} />
          </div>
        </FormSection>

        <FormSection icon="group" title="Contato e Emergência">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Email" type="email" value={form.email} onChange={set('email')} placeholder="email@exemplo.com" />
            <MaskedField
              label="Telefone / WhatsApp"
              required
              mask={phoneMask}
              value={form.phone}
              onChange={set('phone')}
              onBlur={e => {
                const digits = e.target.value.replace(/\D/g, '');
                setPhoneMask(digits.length > 10 ? '(99) 99999-9999' : '(99) 9999-9999');
              }}
              placeholder="(00) 00000-0000"
            />
            <div className="md:col-span-2 border-t border-dashed border-border-light dark:border-border-dark my-4 pt-4">
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Contato de Emergência</h3>
            </div>
            <TextField label="Nome do Contato" value={form.emergencyName} onChange={set('emergencyName')} placeholder="Nome do parente ou amigo" />
            <MaskedField label="Telefone de Emergência" mask="(99) 99999-9999" value={form.emergencyPhone} onChange={set('emergencyPhone')} placeholder="(00) 00000-0000" />
          </div>
        </FormSection>

        <FormSection icon="search" title="Endereço">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <MaskedField label="CEP" className="md:col-span-2" mask="99999-999" value={form.cep} onChange={set('cep')} onBlur={handleCepBlur} placeholder="00000-000" />
            <TextField label="Cidade" className="md:col-span-3" value={form.city} onChange={set('city')} />
            <TextField label="UF" className="md:col-span-1" value={form.state} onChange={v => set('state')(v.toUpperCase())} maxLength={2} />
            <TextField label="Logradouro (Rua, Av, etc)" className="md:col-span-4" value={form.street} onChange={set('street')} />
            <TextField label="Número" className="md:col-span-2" value={form.number} onChange={set('number')} />
            <TextField label="Bairro" className="md:col-span-3" value={form.neighborhood} onChange={set('neighborhood')} />
            <TextField label="Complemento" className="md:col-span-3" value={form.complement} onChange={set('complement')} placeholder="Apto, Bloco, etc" />
          </div>
        </FormSection>

        <FormSection icon="description" title="Observações">
          <TextAreaField
            label="Notas / Observações Gerais"
            rows={4}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Ex: Alergias, preferências de horário, histórico relevante..."
          />
        </FormSection>

        <div className="flex justify-end gap-4 pt-6 pb-8 border-t border-border-light dark:border-border-dark">
          <button onClick={() => navigate(-1)} className={cancelButtonClass} type="button">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-lg text-base font-bold text-background-dark bg-primary hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
            type="button"
          >
            {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Salvar Paciente'}
          </button>
        </div>
      </div>
    </div>
  );
};

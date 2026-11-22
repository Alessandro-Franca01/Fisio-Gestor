import { Assessment } from '../../services/assessmentService';

export type AssessmentFieldKey = Exclude<
  keyof Assessment,
  'id' | 'patient_id' | 'user_id' | 'session_id' | 'created_at' | 'updated_at' | 'user' | 'patient' | 'session' | 'pain_level'
>;

export type FieldConfig =
  | { kind: 'text'; key: AssessmentFieldKey; label: string; placeholder: string }
  | { kind: 'textarea'; key: AssessmentFieldKey; label: string; placeholder: string; rows?: number }
  | { kind: 'range'; key: 'pain_level'; label: string };

export interface SectionConfig {
  id: string;
  title: string;
  defaultExpanded: boolean;
  fields: FieldConfig[];
}

const area = (key: AssessmentFieldKey, label: string, placeholder: string, rows?: number): FieldConfig => ({
  kind: 'textarea',
  key,
  label,
  placeholder,
  rows,
});

const text = (key: AssessmentFieldKey, label: string, placeholder: string): FieldConfig => ({
  kind: 'text',
  key,
  label,
  placeholder,
});

export const ASSESSMENT_SECTIONS: SectionConfig[] = [
  {
    id: 'history',
    title: '1. Histórico do Paciente',
    defaultExpanded: true,
    fields: [
      area('chief_complaint', 'Queixa Principal', 'Descrição da queixa principal do paciente'),
      text('duration', 'Duração do Problema', 'Ex: 2 meses, 3 semanas'),
      text('onset_type', 'Tipo de Início', 'Ex: Súbito, Gradual, Após trauma'),
      { kind: 'range', key: 'pain_level', label: 'Nível de Dor (0-10)' },
      area('previous_treatments', 'Tratamentos Anteriores', 'Descreva tratamentos anteriores realizados'),
      area('medical_history', 'Histórico Médico Relevante', 'Doenças, condições ou eventos relevantes'),
      area('medications', 'Medicações em Uso', 'Lista de medicações atuais'),
      area('surgery_procedures', 'Cirurgias/Procedimentos', 'Cirurgias ou procedimentos prévios'),
    ],
  },
  {
    id: 'functional',
    title: '2. Avaliação Funcional',
    defaultExpanded: true,
    fields: [
      area('rom_findings', 'Amplitude de Movimento (ROM)', 'Descrição dos achados de amplitude de movimento'),
      area('strength_findings', 'Testes de Força', 'Resultados dos testes de força muscular'),
      area('balance_findings', 'Equilíbrio/Propriocepção', 'Avaliação de equilíbrio e propriocepção'),
      area('gait_findings', 'Avaliação da Marcha', 'Observações sobre padrão de marcha'),
      area('adl_limitations', 'Limitações em Atividades de Vida Diária', 'Descreva limitações funcionais do paciente'),
      area('work_restrictions', 'Restrições de Trabalho/Atividades', 'Restrições relacionadas ao trabalho e atividades'),
    ],
  },
  {
    id: 'examination',
    title: '3. Exame Físico',
    defaultExpanded: true,
    fields: [
      area('posture_assessment', 'Análise Postural', 'Descrição das alterações posturais encontradas'),
      area('palpation_findings', 'Achados à Palpação', 'Achados à palpação (tensão, trigger points, etc)'),
      area('special_tests_results', 'Testes Especiais', 'Resultados de testes ortopédicos/neurológicos especiais'),
      area('edema_findings', 'Edema/Inchaço', 'Presença e localização de edema'),
      area('skin_condition', 'Condição da Pele', 'Observações sobre a pele (feridas, cicatrizes, etc)'),
    ],
  },
  {
    id: 'diagnostic',
    title: '4. Achados Diagnósticos',
    defaultExpanded: false,
    fields: [
      area('diagnostic_findings', 'Achados de Imagem/Diagnósticos', 'Resultados de exames (RX, RM, US, etc)'),
      area('diagnostic_notes', 'Notas Diagnósticas Complementares', 'Observações adicionais sobre diagnósticos'),
    ],
  },
  {
    id: 'assessment',
    title: '5. Avaliação Fisioterapêutica & Diagnóstico',
    defaultExpanded: false,
    fields: [
      area('physio_diagnosis', 'Diagnóstico Fisioterapêutico', 'Análise e diagnóstico fisioterapêutico do caso'),
      area('prognosis', 'Prognóstico', 'Estimativa de recuperação e timeline esperada'),
      area('functional_limitations', 'Resumo das Limitações Funcionais', 'Síntese das limitações funcionais identificadas'),
    ],
  },
  {
    id: 'treatment',
    title: '6. Plano de Tratamento',
    defaultExpanded: false,
    fields: [
      area('treatment_goals_short', 'Objetivos de Curto Prazo', 'Objetivos para as próximas 2-4 semanas'),
      area('treatment_goals_long', 'Objetivos de Longo Prazo', 'Objetivos para o tratamento completo'),
      text('recommended_frequency', 'Frequência Recomendada', 'Ex: 2x semana, 3x semana'),
      text('estimated_duration', 'Duração Estimada', 'Ex: 8 semanas, 12 semanas'),
      area('proposed_interventions', 'Intervenções Propostas', 'Técnicas, exercícios e modalidades terapêuticas'),
      area('home_exercise_plan', 'Programa de Exercícios em Casa', 'Exercícios e cuidados recomendados para casa'),
    ],
  },
  {
    id: 'additional',
    title: '7. Observações Adicionais',
    defaultExpanded: false,
    fields: [area('additional_notes', 'Notas Adicionais', 'Qualquer informação adicional relevante', 4)],
  },
];

export const TEXT_FIELD_KEYS: AssessmentFieldKey[] = ASSESSMENT_SECTIONS.flatMap(s =>
  s.fields.filter(f => f.kind !== 'range').map(f => f.key as AssessmentFieldKey)
);

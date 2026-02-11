import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import assessmentService, { Assessment } from '../services/assessmentService';

// Sub-components defined outside to prevent focus loss on re-renders
const SectionHeader = ({
  title,
  section,
  isExpanded,
  onToggle
}: {
  title: string;
  section: string;
  isExpanded: boolean;
  onToggle: (section: string) => void
}) => (
  <div
    className="flex items-center justify-between p-4 bg-primary/5 border-l-4 border-primary cursor-pointer hover:bg-primary/10 transition-colors"
    onClick={() => onToggle(section)}
  >
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-primary/10 rounded-md text-primary">
        <Icon name="folder_open" className="text-lg" />
      </div>
      <h3 className="text-base font-bold text-text-light dark:text-text-dark">{title}</h3>
    </div>
    <Icon
      name={isExpanded ? 'expand_less' : 'expand_more'}
      className="text-subtle-light dark:text-subtle-dark"
    />
  </div>
);

const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-text-light dark:text-text-dark">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-subtle-light/50 dark:placeholder:text-subtle-dark/50"
    />
  </div>
);

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-text-light dark:text-text-dark">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-subtle-light/50 dark:placeholder:text-subtle-dark/50"
    />
  </div>
);

const RangeInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
}: {
  label: string;
  value: number | '';
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-text-light dark:text-text-dark">{label}</label>
    <div className="flex items-center gap-4 bg-background-light dark:bg-background-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
      <input
        type="range"
        min={min}
        max={max}
        value={value || 0}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="flex-1 h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-bold shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]">
        {value}
      </div>
    </div>
  </div>
);

export const AssessmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const { patientId, assessmentId } = useParams<{ patientId: string; assessmentId?: string }>();
  const isEdit = Boolean(assessmentId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Patient History Section
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [duration, setDuration] = useState('');
  const [onsetType, setOnsetType] = useState('');
  const [painLevel, setPainLevel] = useState<number | ''>(5);
  const [previousTreatments, setPreviousTreatments] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [medications, setMedications] = useState('');
  const [surgeryProcedures, setSurgeryProcedures] = useState('');

  // Functional Assessment Section
  const [romFindings, setRomFindings] = useState('');
  const [strengthFindings, setStrengthFindings] = useState('');
  const [balanceFindings, setBalanceFindings] = useState('');
  const [gaitFindings, setGaitFindings] = useState('');
  const [adlLimitations, setAdlLimitations] = useState('');
  const [workRestrictions, setWorkRestrictions] = useState('');

  // Physical Examination Section
  const [postureAssessment, setPostureAssessment] = useState('');
  const [palpationFindings, setPalpationFindings] = useState('');
  const [specialTestsResults, setSpecialTestsResults] = useState('');
  const [edemaFindings, setEdemaFindings] = useState('');
  const [skinCondition, setSkinCondition] = useState('');

  // Diagnostic Section
  const [diagnosticFindings, setDiagnosticFindings] = useState('');
  const [diagnosticNotes, setDiagnosticNotes] = useState('');

  // Assessment & Diagnosis Section
  const [physioDiagnosis, setPhysioDiagnosis] = useState('');
  const [prognosis, setPrognosis] = useState('');
  const [functionalLimitations, setFunctionalLimitations] = useState('');

  // Treatment Plan Section
  const [treatmentGoalsShort, setTreatmentGoalsShort] = useState('');
  const [treatmentGoalsLong, setTreatmentGoalsLong] = useState('');
  const [recommendedFrequency, setRecommendedFrequency] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [proposedInterventions, setProposedInterventions] = useState('');
  const [homeExercisePlan, setHomeExercisePlan] = useState('');

  // Additional
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    history: true,
    functional: true,
    examination: true,
    diagnostic: false,
    assessment: false,
    treatment: false,
    additional: false,
  });

  useEffect(() => {
    if (isEdit && assessmentId && patientId) {
      fetchAssessment(parseInt(patientId), parseInt(assessmentId));
    }
  }, [assessmentId, patientId, isEdit]);

  const fetchAssessment = async (pId: number, aId: number) => {
    try {
      const assessment = await assessmentService.getAssessmentById(pId, aId);
      populateForm(assessment);
    } catch (err) {
      setError('Erro ao carregar avaliação');
    }
  };

  const populateForm = (assessment: Assessment) => {
    setChiefComplaint(assessment.chief_complaint || '');
    setDuration(assessment.duration || '');
    setOnsetType(assessment.onset_type || '');
    setPainLevel(assessment.pain_level || '');
    setPreviousTreatments(assessment.previous_treatments || '');
    setMedicalHistory(assessment.medical_history || '');
    setMedications(assessment.medications || '');
    setSurgeryProcedures(assessment.surgery_procedures || '');
    setRomFindings(assessment.rom_findings || '');
    setStrengthFindings(assessment.strength_findings || '');
    setBalanceFindings(assessment.balance_findings || '');
    setGaitFindings(assessment.gait_findings || '');
    setAdlLimitations(assessment.adl_limitations || '');
    setWorkRestrictions(assessment.work_restrictions || '');
    setPostureAssessment(assessment.posture_assessment || '');
    setPalpationFindings(assessment.palpation_findings || '');
    setSpecialTestsResults(assessment.special_tests_results || '');
    setEdemaFindings(assessment.edema_findings || '');
    setSkinCondition(assessment.skin_condition || '');
    setDiagnosticFindings(assessment.diagnostic_findings || '');
    setDiagnosticNotes(assessment.diagnostic_notes || '');
    setPhysioDiagnosis(assessment.physio_diagnosis || '');
    setPrognosis(assessment.prognosis || '');
    setFunctionalLimitations(assessment.functional_limitations || '');
    setTreatmentGoalsShort(assessment.treatment_goals_short || '');
    setTreatmentGoalsLong(assessment.treatment_goals_long || '');
    setRecommendedFrequency(assessment.recommended_frequency || '');
    setEstimatedDuration(assessment.estimated_duration || '');
    setProposedInterventions(assessment.proposed_interventions || '');
    setHomeExercisePlan(assessment.home_exercise_plan || '');
    setAdditionalNotes(assessment.additional_notes || '');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    if (!patientId) {
      setError('ID do paciente é obrigatório');
      setIsSubmitting(false);
      return;
    }

    const formData: Partial<Assessment> = {
      chief_complaint: chiefComplaint,
      duration,
      onset_type: onsetType,
      pain_level: painLevel ? parseInt(painLevel.toString()) : null,
      previous_treatments: previousTreatments,
      medical_history: medicalHistory,
      medications,
      surgery_procedures: surgeryProcedures,
      rom_findings: romFindings,
      strength_findings: strengthFindings,
      balance_findings: balanceFindings,
      gait_findings: gaitFindings,
      adl_limitations: adlLimitations,
      work_restrictions: workRestrictions,
      posture_assessment: postureAssessment,
      palpation_findings: palpationFindings,
      special_tests_results: specialTestsResults,
      edema_findings: edemaFindings,
      skin_condition: skinCondition,
      diagnostic_findings: diagnosticFindings,
      diagnostic_notes: diagnosticNotes,
      physio_diagnosis: physioDiagnosis,
      prognosis,
      functional_limitations: functionalLimitations,
      treatment_goals_short: treatmentGoalsShort,
      treatment_goals_long: treatmentGoalsLong,
      recommended_frequency: recommendedFrequency,
      estimated_duration: estimatedDuration,
      proposed_interventions: proposedInterventions,
      home_exercise_plan: homeExercisePlan,
      additional_notes: additionalNotes,
    };

    try {
      if (isEdit && assessmentId) {
        await assessmentService.updateAssessment(
          parseInt(patientId),
          parseInt(assessmentId),
          formData
        );
        setSuccessMessage('Avaliação atualizada com sucesso!');
      } else {
        await assessmentService.createAssessment(parseInt(patientId), formData);
        setSuccessMessage('Avaliação criada com sucesso!');
      }

      setTimeout(() => {
        navigate(`/patient/${patientId}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar avaliação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(`/patient/${patientId}`)}
              className="p-2 hover:bg-primary/10 rounded-lg text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors"
            >
              <Icon name="arrow_back" className="text-2xl" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">
              {isEdit ? 'Editar' : 'Nova'} Avaliação Fisioterapêutica
            </h1>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3">
            <Icon name="error" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl flex items-center gap-3">
            <Icon name="check_circle" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PATIENT HISTORY SECTION */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
            <SectionHeader
              title="1. Histórico do Paciente"
              section="history"
              isExpanded={expandedSections.history}
              onToggle={toggleSection}
            />
            {expandedSections.history && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-4">
                <div className="md:col-span-2">
                  <TextArea
                    label="Queixa Principal"
                    value={chiefComplaint}
                    onChange={setChiefComplaint}
                    placeholder="Descrição da queixa principal do paciente"
                  />
                </div>
                <TextInput
                  label="Duração do Problema"
                  value={duration}
                  onChange={setDuration}
                  placeholder="Ex: 2 meses, 3 semanas"
                />
                <TextInput
                  label="Tipo de Início"
                  value={onsetType}
                  onChange={setOnsetType}
                  placeholder="Ex: Súbito, Gradual, Após trauma"
                />
                <div className="md:col-span-2">
                  <RangeInput
                    label="Nível de Dor (0-10)"
                    value={painLevel}
                    onChange={setPainLevel}
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Tratamentos Anteriores"
                    value={previousTreatments}
                    onChange={setPreviousTreatments}
                    placeholder="Descreva tratamentos anteriores realizados"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Histórico Médico Relevante"
                    value={medicalHistory}
                    onChange={setMedicalHistory}
                    placeholder="Doenças, condições ou eventos relevantes"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Medicações em Uso"
                    value={medications}
                    onChange={setMedications}
                    placeholder="Lista de medicações atuais"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Cirurgias/Procedimentos"
                    value={surgeryProcedures}
                    onChange={setSurgeryProcedures}
                    placeholder="Cirurgias ou procedimentos prévios"
                  />
                </div>
              </div>
            )}
          </div>

          {/* FUNCTIONAL ASSESSMENT SECTION */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
            <SectionHeader
              title="2. Avaliação Funcional"
              section="functional"
              isExpanded={expandedSections.functional}
              onToggle={toggleSection}
            />
            {expandedSections.functional && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-4">
                <div className="md:col-span-2">
                  <TextArea
                    label="Amplitude de Movimento (ROM)"
                    value={romFindings}
                    onChange={setRomFindings}
                    placeholder="Descrição dos achados de amplitude de movimento"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Testes de Força"
                    value={strengthFindings}
                    onChange={setStrengthFindings}
                    placeholder="Resultados dos testes de força muscular"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Equilíbrio/Propriocepção"
                    value={balanceFindings}
                    onChange={setBalanceFindings}
                    placeholder="Avaliação de equilíbrio e propriocepção"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Avaliação da Marcha"
                    value={gaitFindings}
                    onChange={setGaitFindings}
                    placeholder="Observações sobre padrão de marcha"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Limitações em Atividades de Vida Diária"
                    value={adlLimitations}
                    onChange={setAdlLimitations}
                    placeholder="Descreva limitações funcionais do paciente"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Restrições de Trabalho/Atividades"
                    value={workRestrictions}
                    onChange={setWorkRestrictions}
                    placeholder="Restrições relacionadas ao trabalho e atividades"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PHYSICAL EXAMINATION SECTION */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
            <SectionHeader
              title="3. Exame Físico"
              section="examination"
              isExpanded={expandedSections.examination}
              onToggle={toggleSection}
            />
            {expandedSections.examination && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-4">
                <div className="md:col-span-2">
                  <TextArea
                    label="Análise Postural"
                    value={postureAssessment}
                    onChange={setPostureAssessment}
                    placeholder="Descrição das alterações posturais encontradas"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Achados à Palpação"
                    value={palpationFindings}
                    onChange={setPalpationFindings}
                    placeholder="Achados à palpação (tensão, trigger points, etc)"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Testes Especiais"
                    value={specialTestsResults}
                    onChange={setSpecialTestsResults}
                    placeholder="Resultados de testes ortopédicos/neurológicos especiais"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Edema/Inchaço"
                    value={edemaFindings}
                    onChange={setEdemaFindings}
                    placeholder="Presença e localização de edema"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Condição da Pele"
                    value={skinCondition}
                    onChange={setSkinCondition}
                    placeholder="Observações sobre a pele (feridas, cicatrizes, etc)"
                  />
                </div>
              </div>
            )}
          </div>

          {/* DIAGNOSTIC SECTION */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
            <SectionHeader
              title="4. Achados Diagnósticos"
              section="diagnostic"
              isExpanded={expandedSections.diagnostic}
              onToggle={toggleSection}
            />
            {expandedSections.diagnostic && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-4">
                <div className="md:col-span-2">
                  <TextArea
                    label="Achados de Imagem/Diagnósticos"
                    value={diagnosticFindings}
                    onChange={setDiagnosticFindings}
                    placeholder="Resultados de exames (RX, RM, US, etc)"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Notas Diagnósticas Complementares"
                    value={diagnosticNotes}
                    onChange={setDiagnosticNotes}
                    placeholder="Observações adicionais sobre diagnósticos"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ASSESSMENT & DIAGNOSIS SECTION */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
            <SectionHeader
              title="5. Avaliação Fisioterapêutica & Diagnóstico"
              section="assessment"
              isExpanded={expandedSections.assessment}
              onToggle={toggleSection}
            />
            {expandedSections.assessment && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-4">
                <div className="md:col-span-2">
                  <TextArea
                    label="Diagnóstico Fisioterapêutico"
                    value={physioDiagnosis}
                    onChange={setPhysioDiagnosis}
                    placeholder="Análise e diagnóstico fisioterapêutico do caso"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Prognóstico"
                    value={prognosis}
                    onChange={setPrognosis}
                    placeholder="Estimativa de recuperação e timeline esperada"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Resumo das Limitações Funcionais"
                    value={functionalLimitations}
                    onChange={setFunctionalLimitations}
                    placeholder="Síntese das limitações funcionais identificadas"
                  />
                </div>
              </div>
            )}
          </div>

          {/* TREATMENT PLAN SECTION */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
            <SectionHeader
              title="6. Plano de Tratamento"
              section="treatment"
              isExpanded={expandedSections.treatment}
              onToggle={toggleSection}
            />
            {expandedSections.treatment && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-4">
                <div className="md:col-span-2">
                  <TextArea
                    label="Objetivos de Curto Prazo"
                    value={treatmentGoalsShort}
                    onChange={setTreatmentGoalsShort}
                    placeholder="Objetivos para as próximas 2-4 semanas"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Objetivos de Longo Prazo"
                    value={treatmentGoalsLong}
                    onChange={setTreatmentGoalsLong}
                    placeholder="Objetivos para o tratamento completo"
                  />
                </div>
                <TextInput
                  label="Frequência Recomendada"
                  value={recommendedFrequency}
                  onChange={setRecommendedFrequency}
                  placeholder="Ex: 2x semana, 3x semana"
                />
                <TextInput
                  label="Duração Estimada"
                  value={estimatedDuration}
                  onChange={setEstimatedDuration}
                  placeholder="Ex: 8 semanas, 12 semanas"
                />
                <div className="md:col-span-2">
                  <TextArea
                    label="Intervenções Propostas"
                    value={proposedInterventions}
                    onChange={setProposedInterventions}
                    placeholder="Técnicas, exercícios e modalidades terapêuticas"
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Programa de Exercícios em Casa"
                    value={homeExercisePlan}
                    onChange={setHomeExercisePlan}
                    placeholder="Exercícios e cuidados recomendados para casa"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ADDITIONAL NOTES SECTION */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
            <SectionHeader
              title="7. Observações Adicionais"
              section="additional"
              isExpanded={expandedSections.additional}
              onToggle={toggleSection}
            />
            {expandedSections.additional && (
              <div className="p-6 space-y-4">
                <TextArea
                  label="Notas Adicionais"
                  value={additionalNotes}
                  onChange={setAdditionalNotes}
                  placeholder="Qualquer informação adicional relevante"
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-6">
            <button
              type="button"
              onClick={() => navigate(`/patient/${patientId}`)}
              className="px-6 py-2 border border-border-light dark:border-border-dark text-subtle-light dark:text-subtle-dark font-bold rounded-lg hover:bg-primary/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-primary text-background-dark rounded-lg font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin" />
                  <span>Salvando...</span>
                </div>
              ) : (
                <>{isEdit ? 'Atualizar' : 'Criar'} Avaliação</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import assessmentService, { Assessment } from '../services/assessmentService';

export const AssessmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { patientId, assessmentId } = useParams<{ patientId: string; assessmentId: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    if (assessmentId && patientId) {
      fetchAssessment(parseInt(patientId), parseInt(assessmentId));
    }
  }, [assessmentId, patientId]);

  const fetchAssessment = async (pId: number, aId: number) => {
    try {
      setLoading(true);
      const data = await assessmentService.getAssessmentById(pId, aId);
      setAssessment(data);
    } catch (err) {
      setError('Erro ao carregar avaliação');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleDelete = async () => {
    if (!patientId || !assessmentId) return;

    if (window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
      try {
        await assessmentService.deleteAssessment(parseInt(patientId), parseInt(assessmentId));
        navigate(`/patient/${patientId}`);
      } catch (err) {
        setError('Erro ao deletar avaliação');
      }
    }
  };

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <div
      className="flex items-center justify-between p-4 bg-blue-50 border-l-4 border-blue-500 cursor-pointer hover:bg-blue-100"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center gap-2">
        <Icon name="folder" className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <Icon
        name={expandedSections[section] ? 'expand_less' : 'expand_more'}
        className="text-blue-600"
      />
    </div>
  );

  const FieldDisplay = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-gray-900 text-base whitespace-pre-wrap">{value}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="hourglass_empty" className="text-blue-600 text-5xl animate-spin" />
          <p className="text-gray-600 mt-4">Carregando avaliação...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
            <Icon name="error" className="text-red-600 text-4xl mx-auto mb-4" />
            <p className="text-red-700">{error || 'Avaliação não encontrada'}</p>
            <button
              onClick={() => navigate(`/patient/${patientId}`)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Voltar ao paciente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(`/patient/${patientId}`)}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              <Icon name="arrow_back" className="text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">Avaliação Fisioterapêutica</h1>
              <p className="text-gray-600 mt-1">
                Paciente: {assessment.patient?.name || 'N/A'} | Avaliador: {assessment.user?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Criada em: {formatDate(assessment.created_at)}
                {assessment.updated_at !== assessment.created_at && (
                  <> | Atualizada em: {formatDate(assessment.updated_at)}</>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/patient/${patientId}/assessment/${assessmentId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Icon name="edit" />
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Icon name="delete" />
              Deletar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* PATIENT HISTORY SECTION */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="1. Histórico do Paciente" section="history" />
            {expandedSections.history && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-6">
                <div className="md:col-span-2">
                  <FieldDisplay label="Queixa Principal" value={assessment.chief_complaint} />
                </div>
                <FieldDisplay label="Duração do Problema" value={assessment.duration} />
                <FieldDisplay label="Tipo de Início" value={assessment.onset_type} />
                {assessment.pain_level !== null && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600">Nível de Dor (0-10)</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full"
                          style={{ width: `${(assessment.pain_level / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-red-600">{assessment.pain_level}</span>
                    </div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <FieldDisplay label="Tratamentos Anteriores" value={assessment.previous_treatments} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Histórico Médico Relevante" value={assessment.medical_history} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Medicações em Uso" value={assessment.medications} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Cirurgias/Procedimentos" value={assessment.surgery_procedures} />
                </div>
              </div>
            )}
          </div>

          {/* FUNCTIONAL ASSESSMENT SECTION */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="2. Avaliação Funcional" section="functional" />
            {expandedSections.functional && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-6">
                <div className="md:col-span-2">
                  <FieldDisplay label="Amplitude de Movimento (ROM)" value={assessment.rom_findings} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Testes de Força" value={assessment.strength_findings} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Equilíbrio/Propriocepção" value={assessment.balance_findings} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Avaliação da Marcha" value={assessment.gait_findings} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay
                    label="Limitações em Atividades de Vida Diária"
                    value={assessment.adl_limitations}
                  />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay
                    label="Restrições de Trabalho/Atividades"
                    value={assessment.work_restrictions}
                  />
                </div>
              </div>
            )}
          </div>

          {/* PHYSICAL EXAMINATION SECTION */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="3. Exame Físico" section="examination" />
            {expandedSections.examination && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-6">
                <div className="md:col-span-2">
                  <FieldDisplay label="Análise Postural" value={assessment.posture_assessment} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Achados à Palpação" value={assessment.palpation_findings} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Testes Especiais" value={assessment.special_tests_results} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Edema/Inchaço" value={assessment.edema_findings} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Condição da Pele" value={assessment.skin_condition} />
                </div>
              </div>
            )}
          </div>

          {/* DIAGNOSTIC SECTION */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="4. Achados Diagnósticos" section="diagnostic" />
            {expandedSections.diagnostic && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-6">
                <div className="md:col-span-2">
                  <FieldDisplay label="Achados de Imagem/Diagnósticos" value={assessment.diagnostic_findings} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay
                    label="Notas Diagnósticas Complementares"
                    value={assessment.diagnostic_notes}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ASSESSMENT & DIAGNOSIS SECTION */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="5. Avaliação Fisioterapêutica & Diagnóstico" section="assessment" />
            {expandedSections.assessment && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-6">
                <div className="md:col-span-2">
                  <FieldDisplay label="Diagnóstico Fisioterapêutico" value={assessment.physio_diagnosis} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Prognóstico" value={assessment.prognosis} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay
                    label="Resumo das Limitações Funcionais"
                    value={assessment.functional_limitations}
                  />
                </div>
              </div>
            )}
          </div>

          {/* TREATMENT PLAN SECTION */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="6. Plano de Tratamento" section="treatment" />
            {expandedSections.treatment && (
              <div className="p-6 space-y-4 md:grid md:grid-cols-2 md:gap-6">
                <div className="md:col-span-2">
                  <FieldDisplay label="Objetivos de Curto Prazo" value={assessment.treatment_goals_short} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Objetivos de Longo Prazo" value={assessment.treatment_goals_long} />
                </div>
                <FieldDisplay label="Frequência Recomendada" value={assessment.recommended_frequency} />
                <FieldDisplay label="Duração Estimada" value={assessment.estimated_duration} />
                <div className="md:col-span-2">
                  <FieldDisplay label="Intervenções Propostas" value={assessment.proposed_interventions} />
                </div>
                <div className="md:col-span-2">
                  <FieldDisplay label="Programa de Exercícios em Casa" value={assessment.home_exercise_plan} />
                </div>
              </div>
            )}
          </div>

          {/* ADDITIONAL NOTES SECTION */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <SectionHeader title="7. Observações Adicionais" section="additional" />
            {expandedSections.additional && (
              <div className="p-6">
                <FieldDisplay label="Notas Adicionais" value={assessment.additional_notes} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

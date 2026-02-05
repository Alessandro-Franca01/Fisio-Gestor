import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import assessmentService, { Assessment } from '../services/assessmentService';

interface AssessmentListProps {
  patientId?: string;
}

export const AssessmentList: React.FC<AssessmentListProps> = ({ patientId: propPatientId }) => {
  const navigate = useNavigate();
  const { patientId: paramsPatientId, id: paramsId } = useParams<{ patientId?: string; id?: string }>();

  const effectivePatientId = propPatientId || paramsPatientId || paramsId;
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (effectivePatientId) {
      fetchAssessments(parseInt(effectivePatientId));
    }
  }, [effectivePatientId]);

  const fetchAssessments = async (pId: number) => {
    try {
      setLoading(true);
      const data = await assessmentService.getAssessmentsByPatient(pId);
      setAssessments(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError('Erro ao carregar avaliações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assessmentId: number) => {
    if (!effectivePatientId) return;

    if (window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
      try {
        await assessmentService.deleteAssessment(parseInt(effectivePatientId), assessmentId);
        fetchAssessments(parseInt(effectivePatientId));
      } catch (err) {
        setError('Erro ao deletar avaliação');
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="hourglass_empty" className="text-blue-600 text-4xl animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Carregando avaliações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon name="assignment_turned_in" />
          </div>
          <h2 className="text-lg font-bold text-text-light dark:text-text-dark">Avaliações Fisioterapêuticas</h2>
        </div>
        {effectivePatientId && (
          <button
            onClick={() => navigate(`/patient/${effectivePatientId}/assessment/new`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark rounded-lg hover:bg-opacity-90 transition font-bold text-sm"
          >
            <Icon name="add" />
            <span className="hidden sm:inline">Nova Avaliação</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2 text-sm">
          <Icon name="error" />
          {error}
        </div>
      )}

      {assessments.length === 0 ? (
        <div className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl p-8 text-center">
          <Icon name="assignment" className="text-subtle-light dark:text-subtle-dark text-5xl mx-auto mb-4" />
          <p className="text-subtle-light dark:text-subtle-dark mb-4">Nenhuma avaliação fisioterapêutica registrada</p>
          {effectivePatientId && (
            <button
              onClick={() => navigate(`/patient/${effectivePatientId}/assessment/new`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition font-bold text-sm"
            >
              <Icon name="add" />
              Criar Primeira Avaliação
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl p-5 hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => navigate(`/patient/${effectivePatientId}/assessment/${assessment.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                    <h3 className="text-base font-semibold text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
                      Avaliação de {assessment.chief_complaint || 'Fisioterapia'}
                    </h3>
                  </div>
                  <p className="text-xs text-subtle-light dark:text-subtle-dark">
                    Criada em {formatDate(assessment.created_at)} {assessment.user?.name && `por ${assessment.user.name}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/patient/${effectivePatientId}/assessment/${assessment.id}/edit`);
                    }}
                    className="p-2 text-subtle-light dark:text-subtle-dark hover:text-primary hover:bg-primary/10 rounded-lg transition"
                  >
                    <Icon name="edit" className="text-sm" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(assessment.id);
                    }}
                    className="p-2 text-subtle-light dark:text-subtle-dark hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Icon name="delete" className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Summary Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {assessment.pain_level !== null && (
                  <div className="bg-surface-light dark:bg-surface-dark p-2 rounded-lg border border-border-light dark:border-border-dark">
                    <p className="text-[10px] uppercase tracking-wider text-subtle-light dark:text-subtle-dark font-bold">Dor</p>
                    <p className="text-sm font-bold text-red-500">{assessment.pain_level}/10</p>
                  </div>
                )}
                {assessment.duration && (
                  <div className="bg-surface-light dark:bg-surface-dark p-2 rounded-lg border border-border-light dark:border-border-dark">
                    <p className="text-[10px] uppercase tracking-wider text-subtle-light dark:text-subtle-dark font-bold">Duração</p>
                    <p className="text-sm font-semibold text-text-light dark:text-text-dark">{assessment.duration}</p>
                  </div>
                )}
                {assessment.recommended_frequency && (
                  <div className="bg-surface-light dark:bg-surface-dark p-2 rounded-lg border border-border-light dark:border-border-dark">
                    <p className="text-[10px] uppercase tracking-wider text-subtle-light dark:text-subtle-dark font-bold">Frequência</p>
                    <p className="text-sm font-semibold text-text-light dark:text-text-dark">{assessment.recommended_frequency}</p>
                  </div>
                )}
                {assessment.estimated_duration && (
                  <div className="bg-surface-light dark:bg-surface-dark p-2 rounded-lg border border-border-light dark:border-border-dark">
                    <p className="text-[10px] uppercase tracking-wider text-subtle-light dark:text-subtle-dark font-bold">Total Est.</p>
                    <p className="text-sm font-semibold text-text-light dark:text-text-dark">{assessment.estimated_duration}</p>
                  </div>
                )}
              </div>

              {/* Preview */}
              {assessment.physio_diagnosis && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border-l-2 border-primary">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-primary mb-1">Diagnóstico</p>
                  <p className="text-xs text-text-light dark:text-text-dark line-clamp-2 leading-relaxed">{assessment.physio_diagnosis}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import assessmentService, { Assessment } from '../services/assessmentService';

export const AssessmentList: React.FC = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      fetchAssessments(parseInt(patientId));
    }
  }, [patientId]);

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
    if (!patientId) return;

    if (window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
      try {
        await assessmentService.deleteAssessment(parseInt(patientId), assessmentId);
        fetchAssessments(parseInt(patientId));
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="assignment_turned_in" className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">Avaliações Fisioterapêuticas</h2>
        </div>
        {patientId && (
          <button
            onClick={() => navigate(`/patient/${patientId}/assessment/new`)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Icon name="add" />
            Nova Avaliação
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <Icon name="error" />
          {error}
        </div>
      )}

      {assessments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Icon name="assignment" className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Nenhuma avaliação fisioterapêutica registrada</p>
          {patientId && (
            <button
              onClick={() => navigate(`/patient/${patientId}/assessment/new`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/patient/${patientId}/assessment/${assessment.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Avaliação de {assessment.chief_complaint || 'Fisioterapia'}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Criada em {formatDate(assessment.created_at)} por {assessment.user?.name || 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/patient/${patientId}/assessment/${assessment.id}/edit`);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Icon name="edit" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(assessment.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Icon name="delete" />
                  </button>
                </div>
              </div>

              {/* Summary Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {assessment.pain_level !== null && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Nível de Dor</p>
                    <p className="text-lg font-bold text-red-600">{assessment.pain_level}/10</p>
                  </div>
                )}
                {assessment.duration && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Duração</p>
                    <p className="text-sm font-semibold text-gray-800">{assessment.duration}</p>
                  </div>
                )}
                {assessment.recommended_frequency && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Frequência</p>
                    <p className="text-sm font-semibold text-gray-800">{assessment.recommended_frequency}</p>
                  </div>
                )}
                {assessment.estimated_duration && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Dur. Estimada</p>
                    <p className="text-sm font-semibold text-gray-800">{assessment.estimated_duration}</p>
                  </div>
                )}
              </div>

              {/* Preview */}
              {assessment.physio_diagnosis && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-medium text-blue-600 mb-1">Diagnóstico</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{assessment.physio_diagnosis}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

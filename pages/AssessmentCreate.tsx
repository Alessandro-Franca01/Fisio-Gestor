import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { AssessmentFormSection } from '../components/assessment/AssessmentFormSection';
import { ASSESSMENT_SECTIONS, TEXT_FIELD_KEYS } from '../components/assessment/sections';
import assessmentService, { Assessment } from '../services/assessmentService';

const initialTexts = (): Record<string, string> => Object.fromEntries(TEXT_FIELD_KEYS.map(k => [k, '']));

const initialExpanded = (): Record<string, boolean> =>
  Object.fromEntries(ASSESSMENT_SECTIONS.map(s => [s.id, s.defaultExpanded]));

export const AssessmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const { patientId, assessmentId } = useParams<{ patientId: string; assessmentId?: string }>();
  const isEdit = Boolean(assessmentId);
  const patientPage = `/patients/${patientId}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [texts, setTexts] = useState<Record<string, string>>(initialTexts);
  const [painLevel, setPainLevel] = useState<number | ''>(5);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded);

  useEffect(() => {
    if (!isEdit || !assessmentId || !patientId) return;
    (async () => {
      try {
        const assessment = await assessmentService.getAssessmentById(parseInt(patientId), parseInt(assessmentId));
        setTexts(
          Object.fromEntries(TEXT_FIELD_KEYS.map(k => [k, (assessment[k as keyof Assessment] as string | null) || '']))
        );
        setPainLevel(assessment.pain_level ?? '');
      } catch {
        setError('Erro ao carregar avaliação');
      }
    })();
  }, [assessmentId, patientId, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!patientId) {
      setError('ID do paciente é obrigatório');
      return;
    }

    const payload: Partial<Assessment> = {
      ...texts,
      pain_level: painLevel === '' ? null : painLevel,
    };

    setIsSubmitting(true);
    try {
      if (isEdit && assessmentId) {
        await assessmentService.updateAssessment(parseInt(patientId), parseInt(assessmentId), payload);
        setSuccessMessage('Avaliação atualizada com sucesso!');
      } else {
        await assessmentService.createAssessment(parseInt(patientId), payload);
        setSuccessMessage('Avaliação criada com sucesso!');
      }
      setTimeout(() => navigate(patientPage), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar avaliação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(patientPage)}
              className="p-2 hover:bg-primary/10 rounded-lg text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors"
            >
              <Icon name="arrow_back" className="text-2xl" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">
              {isEdit ? 'Editar' : 'Nova'} Avaliação Fisioterapêutica
            </h1>
          </div>
        </div>

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
          {ASSESSMENT_SECTIONS.map(section => (
            <AssessmentFormSection
              key={section.id}
              section={section}
              isExpanded={expanded[section.id]}
              onToggle={id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))}
              values={{ texts, painLevel }}
              onTextChange={(key, value) => setTexts(prev => ({ ...prev, [key]: value }))}
              onPainChange={setPainLevel}
            />
          ))}

          <div className="flex gap-4 justify-end pt-6">
            <button
              type="button"
              onClick={() => navigate(patientPage)}
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

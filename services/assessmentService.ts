import api from './api';

export interface Assessment {
  id: number;
  patient_id: number;
  user_id: number;
  session_id: number | null;
  chief_complaint: string | null;
  duration: string | null;
  onset_type: string | null;
  pain_level: number | null;
  previous_treatments: string | null;
  medical_history: string | null;
  medications: string | null;
  surgery_procedures: string | null;
  rom_findings: string | null;
  strength_findings: string | null;
  balance_findings: string | null;
  gait_findings: string | null;
  adl_limitations: string | null;
  work_restrictions: string | null;
  posture_assessment: string | null;
  palpation_findings: string | null;
  special_tests_results: string | null;
  edema_findings: string | null;
  skin_condition: string | null;
  diagnostic_findings: string | null;
  diagnostic_notes: string | null;
  physio_diagnosis: string | null;
  prognosis: string | null;
  functional_limitations: string | null;
  treatment_goals_short: string | null;
  treatment_goals_long: string | null;
  recommended_frequency: string | null;
  estimated_duration: string | null;
  proposed_interventions: string | null;
  home_exercise_plan: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
  };
  patient?: {
    id: number;
    name: string;
  };
  session?: {
    id: number;
    title: string;
  };
}

const assessmentService = {
  // Get all assessments for a patient
  getAssessmentsByPatient: async (patientId: number) => {
    try {
      const response = await api.get(`/patients/${patientId}/assessments`);
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw error;
    }
  },

  // Get single assessment
  getAssessmentById: async (patientId: number, assessmentId: number) => {
    try {
      const response = await api.get(`/patients/${patientId}/assessments/${assessmentId}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
      throw error;
    }
  },

  // Create new assessment
  createAssessment: async (patientId: number, data: Partial<Assessment>) => {
    try {
      const response = await api.post(`/patients/${patientId}/assessments`, data);
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  },

  // Update assessment
  updateAssessment: async (patientId: number, assessmentId: number, data: Partial<Assessment>) => {
    try {
      const response = await api.put(`/patients/${patientId}/assessments/${assessmentId}`, data);
      return response.data?.data ?? response.data;
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      throw error;
    }
  },

  // Delete assessment
  deleteAssessment: async (patientId: number, assessmentId: number) => {
    try {
      const response = await api.delete(`/patients/${patientId}/assessments/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      throw error;
    }
  },
};

export default assessmentService;

import { showAlert } from '@/lib/utils/showAlert';

export interface QuestionFormData {
    Pregunta: string;
    Categoria: string;
    Respuesta1: string;
    Respuesta2: string;
    Respuesta3: string;
    Respuesta4: string;
    CorrectAnswer: string;
}

export const validateQuestionForm = (
    formData: QuestionFormData,
    profileId?: string | number
): boolean => {
    // Validar pregunta
    if (!formData.Pregunta || !formData.Pregunta.trim()) {
        showAlert('Error', 'Por favor indica cuál es la pregunta', 'warning');
        return false;
    }

    // Validar todas las respuestas
    if (!formData.Respuesta1 || !formData.Respuesta1.trim() ||
        !formData.Respuesta2 || !formData.Respuesta2.trim() ||
        !formData.Respuesta3 || !formData.Respuesta3.trim() ||
        !formData.Respuesta4 || !formData.Respuesta4.trim()) {
        showAlert('Error', 'Por favor completa todas las respuestas', 'warning');
        return false;
    }

    // Validar respuesta correcta seleccionada
    if (!formData.CorrectAnswer || !formData.CorrectAnswer.trim()) {
        showAlert('Error', 'Por favor indica cuál es la respuesta correcta', 'warning');
        return false;
    }

    // Validar categoría seleccionada
    if (!formData.Categoria || !formData.Categoria.trim()) {
        showAlert('Error', 'Por favor indica la categoría de la pregunta', 'warning');
        return false;
    }

    // Validar perfil de usuario
    if (!profileId) {
        showAlert('Error', 'No se encontró el perfil de usuario', 'error');
        return false;
    }

    return true;
};

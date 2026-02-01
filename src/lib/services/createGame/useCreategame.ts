import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { Dayjs } from 'dayjs';
import { useAppSelector } from "@/lib/store/hooks";
import { useLogout } from "@/lib/hooks/useLogout";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { showAlert } from "@/lib/utils/showAlert";
import { showPartidaSuccessModal } from '@/lib/constants/modal';
import {
  getAllQuestionsEndpoint,
  assignQuestionsToRoomEndpoint
} from "@/lib/api/Questions";

import {
  createRoomEndpoint, } from "@/lib/api/rooms";

interface FormData {
  titulo: string;
  tipo: 'publica' | 'privada';
  cantidad: string;
  tiempo: string;
  categoria: (string | number)[];
  fecha: string;
  hora: string;
}

export const useCrearPartidaLogic = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user, profile } = useAppSelector((state) => state.auth);

  const [token, setToken] = useState('');
  const [searchQuery] = useState("");
  const [programar, setProgramar] = useState(false);
  const [allCategories, setAllcategories] = useState(false);
  const [questions, setQuestions] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    tipo: 'publica',
    cantidad: '10',
    tiempo: '15',
    categoria: [],
    fecha: '',
    hora: ''
  });

  // Obtener token
  useEffect(() => {
    const authToken = localStorage.getItem('authToken') ||  '';
    setToken(authToken);
  }, []);

  // Obtener preguntas
  const getQuestions = async () => {
    if (!token) return;

    try {
      const response = await getAllQuestionsEndpoint(token);

      // Filtrar solo las preguntas aprobadas
      const elementosAprobados = response.filter((elemento: any) => elemento.IsAproved);

      // Agrupar por categoría
      const elementosPorCategoria = elementosAprobados.reduce((acc: any, elemento: any) => {
        if (!acc[elemento.category.id]) {
          acc[elemento.category.id] = [];
        }
        acc[elemento.category.id].push(elemento);
        return acc;
      }, {});

      setQuestions(elementosPorCategoria);
    } catch (error) {
      handleAxiosError(error, logout);
    }
  };

  useEffect(() => {
    if (token) {
      getQuestions();
    }
  }, [token]);

  // Funciones auxiliares
  const cancelar = useCallback(() => navigate("/dashboard"), [navigate]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const regex = /^[a-zA-Z0-9\s]*$/;

    if (name === 'titulo') {
      if (regex.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else {
        showAlert('Error', 'No se permiten caracteres especiales', 'warning');
        return;
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }, [formData]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const regex = /^[a-zA-Z0-9\s]$/;
    if (!regex.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }, []);

  const handleSelectCategory = useCallback((category: (string | number)[]) => {
    setFormData({ ...formData, categoria: category });
  }, [formData]);

  const setProgramarmatch = useCallback(() => {
    setProgramar(!programar);
    if (programar) {
      setFormData({ ...formData, fecha: '', hora: '' });
    }
  }, [programar, formData]);

  const setUsarcategorias = useCallback(() => {
    setAllcategories(!allCategories);
  }, [allCategories]);

  const onChange = useCallback((date: Dayjs | null, dateString: string | string[]) => {
    if (!date || typeof dateString !== 'string') return;

    const today = new Date();
    const selectedDate = new Date(dateString);

    if (selectedDate < today) {
      showAlert('Fecha inválida', 'La fecha seleccionada no puede ser anterior al día de hoy', 'warning');
      return;
    }
    setFormData({ ...formData, fecha: dateString });
  }, [formData]);

  const timeChange = useCallback((_time: Dayjs | null, timeString: string | string[]) => {
  if (typeof timeString !== 'string') return;
  
  const formattedTime = timeString.replace(':', '').padStart(4, '0');
  
  setFormData(prev => ({
    ...prev,
    hora: formattedTime
  }));
}, []);

  // Funciones de selección aleatoria
  const seleccionarAleatorios = useCallback((array: any[], cantidad: number) => {
    const resultado = [];
    const arrayCopia = [...array];

    for (let i = 0; i < cantidad; i++) {
      if (arrayCopia.length === 0) break;
      const randomIndex = Math.floor(Math.random() * arrayCopia.length);
      resultado.push(arrayCopia[randomIndex].id);
      arrayCopia.splice(randomIndex, 1);
    }

    return resultado;
  }, []);

  const obtenerPreguntasAleatorias = useCallback(() => {
    const cantidad = parseInt(formData.cantidad);
    let todasLasPreguntas: any[] = [];

    formData.categoria.forEach(categoria => {
      if (questions[categoria]) {
        todasLasPreguntas = [...todasLasPreguntas, ...questions[categoria]];
      }
    });

    return seleccionarAleatorios(todasLasPreguntas, cantidad);
  }, [formData.cantidad, formData.categoria, questions, seleccionarAleatorios]);

  // Asociar preguntas
  const assignQuestions = useCallback(async (roomId: string | number, questionIds: (string | number)[]) => {
    try {
      await assignQuestionsToRoomEndpoint(roomId, questionIds, token);
    } catch (error) {
      handleAxiosError(error, logout);
    }
  }, [token, logout]);

  // Validaciones y envío
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.titulo) {
      showAlert('Error', 'Por favor especifica el nombre de la partida', 'warning');
      return;
    }

    if (formData.categoria.length === 0) {
      showAlert('Error', 'Por favor selecciona una o más categorías para la partida', 'warning');
      return;
    }

    if (!formData.cantidad || !formData.tiempo) {
      showAlert('Error', 'Por favor especifica la cantidad de preguntas y el tiempo por pregunta', 'warning');
      return;
    }

    if (!formData.tipo) {
      showAlert('Error', 'Elije un tipo de partida si es pública o privada', 'warning');
      return;
    }

    // Obtener preguntas aleatorias
    const preguntasSeleccionadas = obtenerPreguntasAleatorias();

    if (preguntasSeleccionadas.length < parseInt(formData.cantidad)) {
      showAlert('Error', 'No hay suficientes preguntas disponibles con las categorías seleccionadas', 'warning');
      return;
    }

    if (formData.fecha && !formData.hora) {
      showAlert('Error', 'Por favor especifica la hora de la partida programada', 'warning');
      return;
    }

    if (!formData.fecha && formData.hora) {
      showAlert('Error', 'Por favor especifica la fecha de la partida programada', 'warning');
      return;
    }

    if (!profile?.id) {
      showAlert('Error', 'No se encontró el perfil de usuario', 'error');
      return;
    }

    setLoading(true);

    try {
      const roomData: any = {
        profileId: profile.id,
        room_name: formData.titulo,
        state: formData.fecha ? 'PROGRAMADA' : 'EN_DIRECTO',
        max_user: 5000,
        room_code: formData.titulo.split(' ').join('-'),
        issue: "General Discussion",
        number_questions: formData.cantidad,
        time_question: formData.tiempo,
        chat_enable: true,
        categoryIds: formData.categoria,
        is_private: formData.tipo === 'privada',
        author: true
      };

      if (formData.fecha) {
        roomData.start_date = formData.fecha;
        roomData.start_time = parseInt(formData.hora, 10);
      }

      const response = await createRoomEndpoint(roomData, token);

      // Asociar preguntas
      await assignQuestions(response.id, preguntasSeleccionadas);

      // Mostrar modal de éxito
      showPartidaSuccessModal(
        response,
        formData.tipo,
        formData.cantidad,
        formData.tiempo
      );

    } catch (error: any) {
      if (error?.response?.data?.message === 'El código de sala debe ser único.') {
        showAlert('Error', 'Ya hay una sala programada con este nombre', 'error');
      } else if (error?.response?.data?.message === 'Ya tienes una sala programada activa.') {
        showAlert('Ya has programado una sala', 'Espera a que termine para programar otra partida', 'warning');
      } else if (error?.response?.data?.message === 'Ya tienes una sala pública activa.') {
        showAlert('Solo puedes tener una sala pública activa', 'Espera a que termine para crear otra partida pública', 'warning');
      } else if (error?.response?.data?.message === 'Ya tienes una sala privada activa.') {
        showAlert('Solo puedes tener una sala privada activa', 'Espera a que termine para crear otra partida privada', 'warning');
      } else {
        handleAxiosError(error, logout);
      }
    } finally {
      setLoading(false);
    }
  }, [formData, profile?.id, token, obtenerPreguntasAleatorias, assignQuestions, logout]);

  return {
    token,
    user,
    searchQuery,
    programar,
    allCategories,
    loading,
    formData,
    handleChange,
    handleKeyDown,
    handleSelectCategory,
    setProgramarmatch,
    setUsarcategorias,
    onChange,
    timeChange,
    cancelar,
    handleSubmit
  };
};
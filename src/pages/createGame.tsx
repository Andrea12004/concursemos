import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DatePicker, TimePicker, ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import esES from 'antd/locale/es_ES';
import 'dayjs/locale/es';
import '@/components/createGame/css/styles.css'
import StyledCheckbox from "@/components/UI/Checkbox/StyledCheckbox";
import { showPartidaSuccessModal } from '@/lib/constants/modal';
// Importar componentes propios
 import Layout from '@/components/layout/layout';
 import { Input } from '@/components/UI/Inputs/input';
 import RadioOption from '@/components/UI/Inputs/RadioOption';
//  import Button from '@/components/UI/Button/button';
import Select from '@/components/UI/Select/Select';
 import Carrusel from '@/components/createGame/carouselCreategame'; 
 import CategoriaModal from '@/components/modals/modalCategory-bank'; 

dayjs.extend(customParseFormat);
dayjs.locale('es');

import type { FormData, AuthResponse, Question, QuestionsByCategory } from '@/lib/types/createGame';

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const CrearPartida: React.FC = () => {
  const navigate = useNavigate();
  const format = 'HH:mm';

  // ========================================
  // ESTADOS
  // ========================================
  
  // Estados de autenticación
  const [token, setToken] = useState<string>('');
  const [rol, setRol] = useState<string>('');
  const [profile, setProfile] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState('publica');
  
  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    tipo: 'publica',
    cantidad: '10',
    tiempo: '15',
    categoria: [],
    fecha: '',
    hora: ''
  });

  // Estados de UI
  const [programar, setProgramar] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<boolean>(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number[]>([]);
  
  // Estados de datos
  const [questions, setQuestions] = useState<QuestionsByCategory>({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([]);

  // ========================================
  // EFECTOS
  // ========================================

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const authResponseStr = localStorage.getItem('authResponse');
    if (authResponseStr) {
      const authResponse: AuthResponse = JSON.parse(authResponseStr);
      setToken(authResponse.accesToken);
      setRol(authResponse.user.role);
      setProfile(authResponse.user.profile.id);
    }
  }, []);

  // Cargar preguntas cuando tengamos el token
useEffect(() => {
    if (token) {
      // MODO DESARROLLO: Usar datos simulados
      createMockQuestions();
      
      // MODO PRODUCCIÓN: Descomentar cuando tengas el backend
      // getQuestions();
    }
  }, [token]);

  const createMockQuestions = () => {
    const mockQuestions: QuestionsByCategory = {};
    
    // Crear 100 preguntas por cada categoría (IDs del 1 al 10)
    for (let catId = 1; catId <= 10; catId++) {
      mockQuestions[catId] = [];
      for (let i = 1; i <= 100; i++) {
        mockQuestions[catId].push({
          id: catId * 1000 + i,
          category: {
            id: catId,
            category: `Categoría ${catId}`
          },
          IsAproved: true
        });
      }
    }
    
    setQuestions(mockQuestions);
    setCategoriasDisponibles(Object.keys(mockQuestions));
  };

  // ========================================
  // FUNCIONES DE NAVEGACIÓN
  // ========================================

  const logout = () => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  const cancelar = () => {
    navigate("/dashboard");
  };

  // ========================================
  // MANEJADORES DE CAMBIOS EN EL FORMULARIO
  // ========================================

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const regex = /^[a-zA-Z0-9\s]*$/;
        if(name == 'titulo') {
          if (regex.test(value)) {
              setFormData({
                  ...formData,
                  [name]: value,
              });
          } else {
              alert("No se permiten caracteres especiales.");
          }
        }

          setFormData({
            ...formData,
            [name]: value
        });
        if(name == 'tipo'){
          setSelectedValue(e.target.value);
        }
        //console.log(name,value)
    };

  const handleKeyDown= (event: React.KeyboardEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9\s]$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  };

  // ========================================
  // MANEJADORES DE FECHA Y HORA
  // ========================================

  const onChange = (date: Dayjs | null, dateString: string | string[]) => {
    if (!date || typeof dateString !== 'string') return;

    const today = new Date();
    const selectedDate = new Date(dateString);

    if (selectedDate < today) {
      Swal.fire({
        title: "Fecha inválida",
        text: "La fecha seleccionada no puede ser anterior al día de hoy",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      fecha: dateString
    }));
  };

  const timeChange = (time: Dayjs | null, timeString: string | string[]) => {
    if (typeof timeString !== 'string') return;
    
    const formattedTime = timeString.replace(':', '').padStart(4, '0');
    
    setFormData(prev => ({
      ...prev,
      hora: formattedTime
    }));
  };

  // ========================================
  // MANEJADORES DE CHECKBOXES
  // ========================================

  const setProgramarmatch = () => {
            setProgramar(!programar)
            if(!programar == false){
                setFormData({
                    ...formData,
                    fecha: '',
                    hora: ''
                });
                formData.fecha == '';
                formData.hora == '';
            }
        }

  const setUsarcategorias = () => {
          setAllCategories(!allCategories)
        }

  // ========================================
  // FUNCIÓN PARA SELECCIONAR PREGUNTAS ALEATORIAS
  // ========================================

  const seleccionarAleatorios = (array: Question[], cantidad: number): number[] => {
    const resultado: number[] = [];
    const arrayCopia = [...array];
  
    for (let i = 0; i < cantidad; i++) {
      if (arrayCopia.length === 0) break;
      const randomIndex = Math.floor(Math.random() * arrayCopia.length);
      resultado.push(arrayCopia[randomIndex].id);
      arrayCopia.splice(randomIndex, 1);
    }
  
    return resultado;
  };

  const obtenerPreguntasAleatorias = (): number[] => {
    const cantidad = parseInt(formData.cantidad);
    let todasLasPreguntas: Question[] = [];
  
    formData.categoria.forEach(categoriaId => {
      if (questions[categoriaId]) {
        todasLasPreguntas = [...todasLasPreguntas, ...questions[categoriaId]];
      }
    });
  
    return seleccionarAleatorios(todasLasPreguntas, cantidad);
  };

  // ========================================
  // MANEJADOR DEL CALLBACK DEL CARRUSEL
  // ========================================

  const handleSelectCategory = (category: number[]) => {
    setCategoriaSeleccionada(category);
    setFormData(prev => ({
      ...prev,
      categoria: category
    }));
  };

  // ========================================
  // VALIDACIONES Y ENVÍO DEL FORMULARIO
  // ========================================

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // ========================================
  // VALIDACIONES (MANTÉN ESTO IGUAL)
  // ========================================
  
  // Validación: Título
  if (formData.titulo === '') {
    Swal.fire({
      title: 'Error',
      text: 'Por favor especifica el nombre de la partida',
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
    return;
  }

  // Validación: Categorías
  if (formData.categoria.length === 0) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor selecciona una o más categorías para la partida',
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
    return;
  }

  // Validación: Cantidad y tiempo
  if (formData.cantidad === '' || formData.tiempo === '') {
    Swal.fire({
      title: 'Error',
      text: 'Por favor especifica la cantidad de preguntas y el tiempo por pregunta',
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
    return;
  }

  // Validación: Preguntas suficientes
  const preguntasSeleccionadas = obtenerPreguntasAleatorias();
  
  if (preguntasSeleccionadas.length < parseInt(formData.cantidad)) {
    Swal.fire({
      title: 'Error',
      text: 'No hay suficientes preguntas disponibles con las categorías seleccionadas',
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
    return;
  }

  // Validación: Fecha y hora programada
  if (formData.fecha && !formData.hora) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor especifica la hora de la partida programada',
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
    return;
  }

  if (!formData.fecha && formData.hora) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor especifica la fecha de la partida programada',
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
    return;
  }

  // ========================================
  // SIMULACIÓN DE CREACIÓN DE PARTIDA
  // ========================================

  console.log('Datos del formulario:', formData);
  console.log('Preguntas seleccionadas:', preguntasSeleccionadas);

  // Crear datos simulados para mostrar en el modal
  const mockPartidaData = {
    room_name: formData.titulo,
    room_code: formData.titulo.toLowerCase()
      .replace(/[^\w\s]/gi, '')  // Quitar caracteres especiales
      .split(' ')
      .join('-'),
    // Nota: El modal espera estos campos pero no los usa directamente
    tipo: formData.tipo,
    cantidad: formData.cantidad,
    tiempo: formData.tiempo,
    categories: formData.categoria.map(id => ({ 
      category: `Categoría ${id}` 
    }))
  };

  // 🎉 MOSTRAR EL MODAL BONITO
  showPartidaSuccessModal(
    mockPartidaData,
    formData.tipo,
    formData.cantidad,
    formData.tiempo
  );
     
  };

  // ========================================
  // FUNCIÓN PARA ASOCIAR PREGUNTAS A LA SALA (PRODUCCIÓN)
  // ========================================
  
  // ⚠️ MODO PRODUCCIÓN: Descomentar cuando tengas el backend
  /*
  const RoomQuestions = async (roomid: number, questions: number[]) => {
    const headers = {
      cnrsms_token: token,
    };

    try {
      const response = await axios.patch(`/questions/${roomid}/questions`, questions, { headers });
      console.log(response);
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message === "Token expirado") {
        Swal.fire({
          title: "Token Expirado",
          text: `Vuelve a ingresar a la plataforma`,
          icon: "error",
          confirmButtonText: "Ok",
        });
        logout();
      } else {
        Swal.fire({
          title: "Error",
          text: `Estamos teniendo fallas técnicas`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };
  */
  
  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================

  return (
    <Layout>
      <div className='content-crear-partida'>
        {/* ENCABEZADO */}
        <div className="">
          <h3 className="text-white">Crear partida</h3>
           {rol == 'BASIC' ? '' : <CategoriaModal/>}
        </div>

        <form onSubmit={handleSubmit}>
          
          <div>
            <label>Titulo:</label>
            <Input
              type="text"
              placeholder="Escribe el título de la partida"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
               onKeyDown={handleKeyDown}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          {/* TIPO DE PARTIDA */}
          <div>
            <label>Tipo de partida:</label>
            <div className="radio-button-container">
              <RadioOption
                id="radio1publico"
                name="tipo"
                value="publica"
                checked={formData.tipo === 'publica'}
                label="Partida pública"
                onChange={handleChange}
              />
              <RadioOption
                id="radio2privado"
                name="tipo"
                value="privada"
                checked={formData.tipo === 'privada'}
                label="Partida privada"
                onChange={handleChange}
              />
            </div>

            <label>Programa tu partida</label>
            <StyledCheckbox
                id="morning"
                label="Programar partida"
                name="programar"
                onClick={setProgramarmatch}
              />

           {
            programar ? 
                <div>
                    <ConfigProvider locale={esES}>
                      <DatePicker onChange={onChange}/>
                    </ConfigProvider>
                    <TimePicker defaultValue={dayjs('00:00', format)} format={format} onChange={timeChange}/>
                </div>
            : ''
        }
          </div>

          {/* CANTIDAD DE PREGUNTAS */}
          <div>
            <label className="block text-white mb-2">Cantidad de preguntas:</label>
            <Select
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                options={[
                  { value: "2", label: "2 preguntas" },
                  { value: "5", label: "5 preguntas" },
                  { value: "10", label: "10 preguntas" },
                  { value: "25", label: "25 preguntas" },
                  { value: "50", label: "50 preguntas" },
                  { value: "75", label: "75 preguntas" },
                ]}
              />

          </div>

          {/* TIEMPO PARA RESPONDER */}
          <div>
            <label >Tiempo para responder:</label>
            <Select
              name="tiempo"
              value={formData.tiempo}
              onChange={handleChange}
              options={[
                { value: "15", label: "15 segundos" },
                { value: "30", label: "30 segundos" },
                { value: "45", label: "45 segundos" },
                { value: "60", label: "60 segundos" },
              ]}
            />

          </div>

          {/* CATEGORÍAS */}
            <div className="flex justify-between w-full">
               <label className="w-[60%]" htmlFor="">Escoge una Categoría:</label>
              <StyledCheckbox
                  id="allCategories"
                  label="¿Usar todas las categorias?"
                  name="allCategories"
                  onClick={setUsarcategorias}
                  className="w-[40%] flex justify-end sm-w-full"
                />

            </div>
            
            <div className="div-carrusel-crear-partida">
              <Carrusel 
                onSelectCategory={handleSelectCategory} 
                allCategories={allCategories}
                searchQuery={searchQuery}
              />
            </div>

          {/* BOTONES */}
          <div className="div-buttons-crear-partida">
              <button type="button" className="cancelar-button-crear-partida" onClick={cancelar}>Cancelar</button>
              <button type="submit" className="save-button-crear-partida">
                  <img src="/svg/header/agregarheadernegro.svg" alt="" />
                  <img src="/svg/header/agregarheaderblanco.svg" alt="" className='hover-create-room' />
                  Crear partida
              </button>
          </div>
          
        </form>
      </div>
    </Layout>
  );
};

export default CrearPartida;
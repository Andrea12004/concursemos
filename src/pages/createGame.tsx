import { ConfigProvider, DatePicker, TimePicker } from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import Layout from '@/components/layout/layout';
import { Input } from '@/components/UI/Inputs/input';
import RadioOption from '@/components/UI/Inputs/RadioOption';
import Select from '@/components/UI/Select/Select';
import Carrusel from '@/components/createGame/carouselCreategame';
import CategoriaModal from '@/components/modals/modalCategory-bank';
import StyledCheckbox from '@/components/UI/Checkbox/StyledCheckbox';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useCrearPartidaLogic } from '@/lib/services/createGame/useCreategame';
import '@/components/createGame/css/styles.css'

dayjs.extend(customParseFormat);
dayjs.locale('es');

export const CrearPartida = () => {
  const {
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
  } = useCrearPartidaLogic();

  const [reloadKey, setReloadKey] = React.useState(0);

  const handleReloadCategories = useCallback(() => {
    setReloadKey(prev => prev + 1);
  }, []);

  const format = 'HH:mm';

  return (
    <Layout>
      <div className='content-crear-partida'>
        {/* ENCABEZADO */}
        <div className="">
          <h3 className="text-white">Crear partida</h3>
    
          {user?.role !== 'BASIC' && (
            <CategoriaModal onReload={handleReloadCategories} />
          )}
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

            {programar && (
              <div>
                <ConfigProvider locale={esES}>
                  <DatePicker onChange={onChange} />
                </ConfigProvider>
                <TimePicker 
                  defaultValue={dayjs('00:00', format)} 
                  format={format} 
                  onChange={timeChange} 
                />
              </div>
            )}
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
            <label>Tiempo para responder:</label>
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
              key={reloadKey}
              onSelectCategory={handleSelectCategory}
              allCategories={allCategories}
              searchQuery={searchQuery}
            />
          </div>

          {/* BOTONES */}
          <div className="div-buttons-crear-partida">
            <button 
              type="button" 
              className="cancelar-button-crear-partida" 
              onClick={cancelar}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="save-button-crear-partida"
              disabled={loading}
            >
              <img src="/svg/header/agregarheadernegro.svg" alt="" />
              <img src="/svg/header/agregarheaderblanco.svg" alt="" className='hover-create-room' />
              {loading ? 'Creando...' : 'Crear partida'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CrearPartida;
import React from "react";
import { Link } from "react-router-dom";
import { Popover } from "antd";
import CrearPregunta from "@/components/modals/createQuestion";
import { Input } from "@/components/UI/Inputs/input";
import { useHeaderLogic } from "@/lib/services/useHeader";
import { useNavigate } from "react-router-dom";
import "./css/header.css";

interface HeaderProps {
  setSearchQuery: (query: string) => void;
  onReloadQuestions?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  setSearchQuery,
  onReloadQuestions,
}) => {
  const { open, notifications, setOpen, handleSearchChange } = useHeaderLogic({
    setSearchQuery,
  });

  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="div-input-search-header">
        <img src="/svg/header/searchinput.svg" alt="Buscar" />
        <Input
          name="search"
          type="text"
          className="input-search-header"
          placeholder="Buscar..."
          onChange={handleSearchChange}
          noFocusRing
        />
      </div>

      <CrearPregunta onReload={onReloadQuestions} />

      <Link to="/crear-partida" className="button-match">
        <img src="/svg/header/agregarheadernegro.svg" alt="Crear partida" />
        <img
          src="/svg/header/agregarheaderblanco.svg"
          alt="Crear partida"
          className="create-hover"
        />
        Crear partida
      </Link>

      <div className="div-accesos-rapidos !gap-4">
        <Popover
          content={
            <>
              <div className="div-notifications">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index}>
                      <p>
                        {notification.text
                          ? `La pregunta "${notification.text}" ha sido reportada`
                          : notification.message || "Notificación"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No hay notificaciones.</p>
                )}
              </div>
              <a onClick={() => setOpen(false)}>Cerrar</a>
            </>
          }
          title="Notificaciones"
          trigger="click"
          open={open}
          onOpenChange={setOpen}
          placement="bottomLeft"
        >
          <button className="notificaciones">
            <p className="notificaciones-flotantes">{notifications.length}</p>
            <img
              src="/svg/header/notificacionesheader.svg"
              alt="Notificaciones"
            />
            <img
              src="/svg/header/notificacioneshover.svg"
              alt="Notificaciones"
              className="svg-accesos-rapidos"
            />
          </button>
        </Popover>

        <button onClick={() => navigate("/perfil")}>
          <img src="/svg/header/perfilheader.svg" alt="Perfil" />
          <img
            src="/svg/header/perfilhover.svg"
            alt="Perfil"
            className="svg-accesos-rapidos"
          />
        </button>
      </div>
    </div>
  );
};

export default Header;

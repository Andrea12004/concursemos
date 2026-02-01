import React from "react";
import Crearusuario from "@/components/modals/createUser";
import { Link } from "react-router-dom";
import CrearPregunta from "@/components/modals/createQuestion";
import { Popover } from "antd";
import "./css/user_header.css";
import { Input } from "@/components/UI/Inputs/input";
import { useHeaderUsersLogic } from "@/lib/services/Users/UseHeader";

interface HeaderUsersProps {
  setSearchQuery: (query: string) => void;
  onRefreshUsers?: () => void;
}

const HeaderUsers: React.FC<HeaderUsersProps> = ({
  setSearchQuery,
  onRefreshUsers,
}) => {
  const {
    open,
    notifications,
    handleOpenChange,
    hide,
    handleSearchChange,
    goPerfil,
  } = useHeaderUsersLogic({ setSearchQuery });

  return (
    <div className="header">
      <div className="div-input-search-header">
        <img src="/svg/header/searchinput.svg" alt="Search" />
        <Input
          name="search"
          type="text"
          className="input-search-header"
          placeholder="Buscar..."
          onChange={handleSearchChange}
          noFocusRing
        />
      </div>

      <Crearusuario onUserCreated={onRefreshUsers} />

      <CrearPregunta />

      <Link to="/crear-partida" className="button-match">
        <img src="/svg/header/agregarheadernegro.svg" alt="Create match" />
        <img
          src="/svg/header/agregarheaderblanco.svg"
          alt="Create match hover"
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
                      <p>La pregunta {notification.text} ha sido reportada</p>
                    </div>
                  ))
                ) : (
                  <p>No hay notificaciones.</p>
                )}
              </div>
              <a onClick={hide}>Cerrar</a>
            </>
          }
          title="Notificaciones"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
          placement="bottomLeft"
        >
          <button className="notificaciones icon-md">
            <p className="notificaciones-flotantes">{notifications.length}</p>
            <img
              src="/svg/header/notificacionesheader.svg"
              alt="Notificaciones"
            />
            <img
              src="/svg/header/notificacioneshover.svg"
              alt="Notificaciones hover"
              className="svg-accesos-rapidos"
            />
          </button>
        </Popover>

        <button onClick={goPerfil} className="icon-md">
          <img src="/svg/header/perfilheader.svg" alt="Perfil" />
          <img
            src="/svg/header/perfilhover.svg"
            alt="Perfil hover"
            className="svg-accesos-rapidos"
          />
        </button>
      </div>
    </div>
  );
};

export default HeaderUsers;

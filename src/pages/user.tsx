import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import HeaderUsers from "@/components/Users/headerUsers";
import TableUsers from "@/components/Users/tableUsers";
import TableRanking from "@/components/Users/tableRanking";
import { useUsuariosLogic } from "@/lib/services/Users/useUser";
import { useRef,useState  } from "react";
import "@/components/Users/css/user.css";

export const Usuarios = () => {
   const [searchQuery, setSearchQuery] = useState<string>("");
  const {  admin, connectedUsers } =
    useUsuariosLogic();

  // Guardar referencias a refreshUsers/refreshRanking del hook
  const refreshUsersRef = useRef<(() => void) | undefined>(undefined);
  const refreshRankingRef = useRef<(() => void) | undefined>(undefined);

  // Actualizar ref cuando TableUsers proporcione refreshUsers
  const handleRefreshUsersReady = (refresh: () => void) => {
    refreshUsersRef.current = refresh;
  };

  // Actualizar ref cuando TableRanking proporcione refreshRanking
  const handleRefreshRankingReady = (refresh: () => void) => {
    refreshRankingRef.current = refresh;
  };

  // Obtener el refresh adecuado según el rol
  const getRefreshCallback = () => {
    return admin ? refreshUsersRef.current : refreshRankingRef.current;
  };

  return (
    <div className="all-dashboard">
      <Sidebar />

      <div className="content-dashboard">
        {/*HEADER*/}
        {admin ? (
          <HeaderUsers
            setSearchQuery={setSearchQuery}
            onRefreshUsers={getRefreshCallback()}
          />
        ) : (
          <Header setSearchQuery={setSearchQuery} />
        )}
        {/*HEADER*/}

        {/*CONTENT*/}
        <div className="flex justify-between h3-content-perfil !w-[97%]">
          <h3 className="h3-content-perfil gap-2">
            {admin ? "Usuarios" : "Ranking de Jugadores"}
          </h3>
          {admin && (
            <h3 className="h3-content-perfil_2 gap-2">
              Usuarios Conectados{" "}
              <span className="textos-peques gris pt-3">
                ({connectedUsers})
              </span>
            </h3>
          )}
        </div>

        <div className="content-usuarios">
          {admin && (
            <TableUsers
              searchQuery={searchQuery}
              onRefreshReady={handleRefreshUsersReady}
            />
          )}
          {!admin && (
            <TableRanking
              searchQuery={searchQuery}
              onRefreshReady={handleRefreshRankingReady}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;

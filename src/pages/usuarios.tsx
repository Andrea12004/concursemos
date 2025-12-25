import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

import type { User } from '@/lib/types/user';
import { fetchMockUsers } from '@/lib/mocks/users';
import Swal from 'sweetalert2';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import HeaderUsers from '@/components/usuarios/header-usuarios';
import TableUsers from '@/components/usuarios/table-users';
import TableRanking from '@/components/usuarios/table-ranking';
import '@/components/usuarios/css/user.css';


export const Usuarios = () => {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // derive admin from auth provider
  const isAdmin = auth.state?.role === 'ADMIN';

  /*Funcion traer usuarios - ahora en modo mock*/
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const data = await fetchMockUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos de prueba',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

    const [conectedUsers, setConectedUsers] = useState(0)
  
   /* useEffect(() => {
      if (token) {
        const fetchUsers = () => {
          socket.emit("totalConnectedUsers", {}); 
        };
        socket.on('totalUsersOnline', (message) => {
          //console.log(message);
          setConectedUsers(message.total)
        });

        const interval = setInterval(fetchUsers, 5000);
    
        // Emitir inmediatamente la primera vez sin esperar el intervalo
        fetchUsers();

        return () => {
          clearInterval(interval);
          socket.off("totalUsersOnline"); 
        };
      }
    }, [token]); */
  
    
  return (
    <div className='all-dashboard'>
        <Sidebar/>

        <div className='content-dashboard'>
            {/*HEADER*/}
             {isAdmin ? <HeaderUsers setSearchQuery={setSearchQuery} /> : <Header setSearchQuery={setSearchQuery} />}
            {/*HEADER*/}

            {/*CONTENT*/}
            <div className='flex justify-between h3-content-perfil !w-[97%]'>
            <h3 className='h3-content-perfil gap-2'>{isAdmin ? 'Usuarios' : 'Ranking de Jugadores'} <span className="textos-peques gris pt-3">({users.length})</span></h3>
            {
              isAdmin ?
              <h3 className='h3-content-perfil_2 gap-2'>{isAdmin ? 'Usuarios Conectados' : 'Ranking de Jugadores'} <span className="textos-peques gris pt-3">({conectedUsers})</span></h3> : ''
            }
            </div>
            <div className='content-usuarios'>
               {isAdmin ? <TableUsers searchQuery={searchQuery}/> : <TableRanking searchQuery={searchQuery}/>} 
            </div>
        </div>
    </div>
  )
}

export default Usuarios;

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import axios from 'axios';
import Swal from "sweetalert2";
import Layout from "@/components/layout/layout";
import Table from "@/components/UI/Table/Table";
import { getColumnsCategorias } from "@/lib/constants/ColumnsTable/categoryColumnsConfig";
import "@/components/Category/css/styles.css";
import type { Category, CategoriasUser as User, CategoriasAuthResponse as AuthResponse } from '@/lib/types/Category';

export const Categorias: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();

  // Cerrar sesión por token expirado
  const logout = (): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  // Traer el objeto user del localStorage
  useEffect(() => {
    try {
      const authResponse = localStorage.getItem("authResponse");
      if (authResponse) {
        const parsedAuthResponse: AuthResponse = JSON.parse(authResponse);
        setToken(parsedAuthResponse.accesToken);
        setUserID(parsedAuthResponse.user.profile.id);
        setUser(parsedAuthResponse.user);
      }
    } catch (error) {
      console.error("Error parsing auth response:", error);
    }
  }, []);

  // Obtener categorías
  const getCategories = async (): Promise<void> => {
    if (!token) return;

    try {
      // Descomenta cuando tengas el backend
      // const response = await axios.get(`questions-category/all`, { headers: { cnrsms_token: token } });
      // setCategories(response.data);

      // Mock data para desarrollo
      const mockCategories: Category[] = [
        {
          id: "1",
          category: "Geografía",
          photo_category: "data:image/jpeg;base64,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",
        },
        {
          id: "2",
          category: "Historia",
          photo_category: "https://via.placeholder.com/220x100",
        },
        {
          id: "3",
          category: "Ciencia",
          photo_category: "https://via.placeholder.com/220x100",
        },
        {
          id: "4",
          category: "Arte",
          photo_category: "https://via.placeholder.com/220x100",
        },
      ];
      setCategories(mockCategories);
    } catch (error: any) {
      if (error?.response?.data?.message === "Token expirado") {
        Swal.fire({
          title: "Token Expirado",
          text: "Vuelve a ingresar a la plataforma",
          icon: "error",
          confirmButtonText: "Ok",
        });
        logout();
      } else {
        Swal.fire({
          title: "Error",
          text: "Estamos teniendo fallas técnicas",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  useEffect(() => {
    if (token) {
      getCategories();
    }
  }, [token]);

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(4);

  // Filtrar categorías por el searchQuery
  const filteredRooms = categories.filter((category) =>
    category.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirmDelete = (id: string): void => {
    Swal.fire({
      title: "¿Estás Seguro?",
      text: "¿Deseas eliminar una categoría?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory(id);
      }
    });
  };

  const deleteCategory = async (id: string): Promise<void> => {
    if (!token) return;

    try {
      // Descomenta cuando tengas el backend
      // await axios.delete(`questions-category/delete/${id}`, { headers: { cnrsms_token: token } });

      Swal.fire({
        title: "Operación Exitosa",
        text: "Se ha eliminado la categoría",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#25293d",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
        }
      });
    } catch (error: any) {
      if (error?.response?.data?.message === "Token expirado") {
        Swal.fire({
          title: "Inicio de sesión expirado",
          text: "Vuelve a ingresar a la plataforma",
          icon: "error",
          confirmButtonText: "Ok",
        });
        logout();
        return;
      }
      Swal.fire({
        title: "Error",
        text: "Estamos teniendo fallas técnicas",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  // Columnas y filas para la tabla (memoizadas)
  const columns = useMemo(
    () => getColumnsCategorias(token, user, confirmDelete),
    [token, user, confirmDelete]
  );

  const rows = useMemo(
    () =>
      filteredRooms.map((cat) => ({
        id: cat.id,
        category: cat.category,
        photo_category:
          cat.photo_category ||
          "https://via.placeholder.com/220x100?text=Sin+Imagen",
      })),
    [filteredRooms]
  );

  return (
    <Layout>
      <div className="h-[10%] flex items-center justify-between w-[98%]">
        <h3 className="h3-content-perfil !h-full flex gap-2 items-center">
          Categorías{" "}
          <span className="textos-peques gris pt-3">({categories.length})</span>
        </h3>
      </div>

      <div className="content-usuarios">
        <div className=" banco-table-container categorias-datagrid">
         <Table
      columns={columns}
      rows={rows}
      totalItems={filteredRooms.length}
      limit={itemsPerPage}
      page={currentPage}
      setPage={setCurrentPage}
      pageSize={itemsPerPage}
      rowHeight={120}  // ← IMPORTANTE: Altura de 120px para las filas
      showExport={false}
      enableFiltering={false}
      autoHeight={false}
    />
        </div>
      </div>
    </Layout>
  );
};

export default Categorias;

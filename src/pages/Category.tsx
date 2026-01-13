import  React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@/components/UI/Table/Table";
import Layout from "@/components/layout/layout";
import { getColumnsCategorias } from "@/lib/constants/ColumnsTable/categoryColumnsConfig";
import { 
  getAllQuestionCategoriesEndpoint, 
  deleteQuestionCategoryEndpoint, 
  type QuestionCategory 
} from "@/lib/api/Questions";
import { showAlert, showConfirm } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";
import "@/components/Category/css/styles.css";

const Categorias = () => {
  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string | number>("");
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0); // MUI DataGrid usa 0-based index
  const itemsPerPage = 4;

  const navigate = useNavigate();
  const { logout } = useLogout();

  // Cargar datos de autenticación del localStorage
  useEffect(() => {
    try {
      const authResponseStr = localStorage.getItem("authResponse");
      if (authResponseStr) {
        const authResponse = JSON.parse(authResponseStr);
        setToken(authResponse.accesToken);
        setUserID(authResponse.user.profile.id);
        setUser(authResponse.user);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al cargar datos de autenticación:", error);
      navigate("/");
    }
  }, [navigate]);

  // Obtener categorías
  const getCategories = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getAllQuestionCategoriesEndpoint(token);
      setCategories(response);
    } catch (error: any) {
      console.error("Error al obtener categorías:", error);

      if (error.response?.data?.message === "Token expirado") {
        await showAlert(
          "Token Expirado",
          "Vuelve a ingresar a la plataforma",
          "error"
        );
        logout();
        return;
      }

      showAlert(
        "Error",
        "Estamos teniendo fallas técnicas al cargar las categorías",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getCategories();
    }
  }, [token]);

  // Confirmar eliminación de categoría
  const confirmDelete = (id: string | number) => {
    showConfirm(
      "¿Estás Seguro?",
      "¿Deseas eliminar esta categoría?",
      "Eliminar",
      () => deleteCategory(String(id))
    );
  };

  // Eliminar categoría
  const deleteCategory = async (id: string) => {
    if (!token) return;

    try {
      await deleteQuestionCategoryEndpoint(id, token);

      await showAlert(
        "Operación Exitosa",
        "Se ha eliminado la categoría",
        "success"
      );

      // Recargar categorías
      location.reload();
    } catch (error: any) {
      console.error("Error al eliminar categoría:", error);

      if (error.response?.data?.message === "Token expirado") {
        await showAlert(
          "Inicio de sesión expirado",
          "Vuelve a ingresar a la plataforma",
          "error"
        );
        logout();
        return;
      }

      showAlert(
        "Error",
        "Estamos teniendo fallas técnicas al eliminar la categoría",
        "error"
      );
    }
  };

  // Filtrar categorías por búsqueda
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter((category) =>
      category.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Configurar columnas de la tabla
  const columns = useMemo(
    () => getColumnsCategorias(token, user, confirmDelete),
    [token, user]
  );

  // Filtrar categorías por el searchQuery
  const filteredRooms = categories.filter((category) =>
    category.category.toLowerCase().includes(searchQuery.toLowerCase())
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
      rows={filteredCategories}
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

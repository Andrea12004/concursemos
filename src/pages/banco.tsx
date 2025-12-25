import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from '@/lib/auth';
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Layout from "@/components/layout/layout";
import Table from "@/components/UI/Table/Table";
import { getColumnsBanco } from "@/lib/constants/BancoColumnsConfig";
import type { Question } from "@/lib/types/banco";
import { MOCK_QUESTIONS } from "@/lib/mocks/questions";
import "@/css/banco.css";
import "@/css/banco-table.css";

export const Banco: React.FC = () => {
  const auth = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string | number>("");
  const [update, setUpdate] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);

  // Toggle to load mock data when no token (useful for development/testing)
  const USE_MOCKS = true;

  const navigate = useNavigate();

  const logout = useCallback((): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authResponse");
      if (!raw) return;
      const authResponse = JSON.parse(raw);
      if (authResponse) {
        setToken(authResponse.accesToken || authResponse.accessToken || "");
        setUserID(authResponse.user?.profile?.id ?? "");
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const getQuestions = useCallback(async (): Promise<void> => {
    const headers = {
      cnrsms_token: token,
    };

    try {
      // Tu lógica de API aquí
    } catch (error: any) {
      if (error?.response?.data?.message === "Token expirado") {
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
          text: `Estamos teniendo fallas tecnicas`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  }, [token, auth.state?.role, userID, logout]);

  useEffect(() => {
    if (token) getQuestions();
  }, [token, update, getQuestions]);

  // If configured, load mock questions when there's no token
  useEffect(() => {
    if (USE_MOCKS && !token) {
      setQuestions(MOCK_QUESTIONS as Question[]);
    }
  }, [token]);

  // Filtros para aprobar/rechazar/reportadas
  const [filterAprove, setFilteraprove] = useState<boolean | null>(true);
  const [filterReport, setFilterreport] = useState<boolean>(false);

  const ordenarPorEstado = useCallback((estado: string) => {
    if (estado === "aprobado") {
      setFilteraprove(true);
      setFilterreport(false);
    } else if (estado === "rechazado") {
      setFilteraprove(false);
      setFilterreport(false);
    } else if (estado === "reportado") {
      setFilterreport(true);
      setFilteraprove(null);
    }
    setCurrentPage(1);
  }, []);

  // Filtrar preguntas según búsqueda y estado (aprobado/rechazado/reportado)
  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    // Busqueda por texto
    if (searchQuery) {
      result = result.filter((question) =>
        question.text?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar orden/filtrado visual según el estado seleccionado
    if (filterReport) {
      // Poner reportadas arriba
      result.sort((a, b) => {
        if (a.isReported && !b.isReported) return -1;
        if (!a.isReported && b.isReported) return 1;
        return 0;
      });
    } else if (filterAprove === true) {
      // Poner aprobadas arriba
      result.sort((a, b) => {
        if (a.IsAproved && !b.IsAproved) return -1;
        if (!a.IsAproved && b.IsAproved) return 1;
        return 0;
      });
    } else if (filterAprove === false) {
      // Poner rechazadas (no aprobadas) arriba
      result.sort((a, b) => {
        if (!a.IsAproved && b.IsAproved) return -1;
        if (a.IsAproved && !b.IsAproved) return 1;
        return 0;
      });
    }

    return result;
  }, [questions, searchQuery, filterAprove, filterReport]);

  // Convertir preguntas a formato de filas para la tabla
  const rows = useMemo(() => {
    return filteredQuestions.map((question) => ({
      id: question.id,
      category: question.category?.category || "Sin categoría",
      text: question.text || "",
      answers: question.answers?.map((res) => res.text).join(", ") || "",
      IsAproved: question.IsAproved,
      isReported: question.isReported,
      author: question.author,
      fullQuestion: question, // Guardamos la pregunta completa para los componentes
    }));
  }, [filteredQuestions]);

  // Obtener columnas
  const columns = useMemo(() => {
    return getColumnsBanco(
      auth.state?.role || 'BASIC',
      userID,
      token,
      auth.state || {},
      () => setUpdate((prev) => !prev),
      ordenarPorEstado,
      filterAprove,
      filterReport
    );
  }, [auth.state?.role, userID, token, auth.state, ordenarPorEstado, filterAprove, filterReport]);

  return (
    <Layout>
      <div className="h-[10%] flex items-center justify-between w-[98%]">
        <h3 className="h3-content-perfil !h-full flex gap-2 items-center">
          Banco de Preguntas{" "}
          <span className="textos-peques gris pt-3">({questions.length})</span>
        </h3>
        {auth.state?.role === "ADMIN" ? (
          <Link
            to="/categorias"
            className="w-[15%] link-categorias-movil py-1 mt-3 text-center rounded-md font-semibold bg-[#f26a2f]"
          >
            Ver Categorias
          </Link>
        ) : null}
      </div>

      <div className="content-usuarios">
        {/* Tabla */}
        <div className="w-full banco-table-container">
          <Table
            columns={columns}
            rows={rows}
            totalItems={filteredQuestions.length}
            limit={itemsPerPage}
            page={currentPage}
            setPage={setCurrentPage}
            pageSize={itemsPerPage}
            showExport={false}
            enableFiltering={false}
            autoHeight={false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Banco;

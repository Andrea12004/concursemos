import React, { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

interface LayoutProps {
  children: React.ReactNode;
  onReloadQuestions?: () => void;
  // Permitir que páginas pasen su propio setter de búsqueda
  setSearchQuery?: (query: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  onReloadQuestions,
  setSearchQuery,
}) => {
  // Si la página no pasó `setSearchQuery`, usamos un estado local como fallback
  const [_searchQuery, _setSearchQuery] = useState<string>("");
  const effectiveSetSearch = setSearchQuery || _setSearchQuery;

  return (
    <div className="all-dashboard">
      <Sidebar />
      <div className="content-dashboard">
        <Header
          setSearchQuery={effectiveSetSearch}
          onReloadQuestions={onReloadQuestions}
        />
        {children}
      </div>
    </div>
  );
};

export default Layout;

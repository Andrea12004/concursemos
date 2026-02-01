import React from "react";
import Slider from "react-slick";
import { useAppSelector } from "@/lib/store/hooks";
import DeleteCategory from './deleteCategory';
import './css/styles.css' 
import { useCarruselLogic } from "@/lib/services/createGame/useCarruselLogic";

interface CarruselProps {
  onSelectCategory: (categoryIds: (string | number)[]) => void;
  allCategories: boolean;
  searchQuery: string;
  onReload?: () => void; 
}

const Carrusel: React.FC<CarruselProps> = ({ 
  onSelectCategory, 
  allCategories, 
  searchQuery,
  onReload 
}) => {
  const {
    selectedCategories,
    token,
    randomGradients,
    sliderSettings,
    selectCategory,
    handleCategoryDeleted,
    filteredCategories
  } = useCarruselLogic({ 
    onSelectCategory, 
    allCategories, 
    searchQuery,
    onReload 
  });

  const { user } = useAppSelector((state) => state.auth);

  return (
    <Slider {...sliderSettings}>
      {filteredCategories.length > 0 ? (
        filteredCategories.map((item) => {
          const gradientClass = randomGradients[item.id] || "";
          const isSelected = selectedCategories.includes(item.id);

          return (
            <div
              key={item.id}
              className={`div-carrusel-item-crear-partida relative ${gradientClass}`}
              onClick={() => selectCategory(item.id)}
            >
              <h3 className={isSelected ? "category-selected" : "titulo-categoria-crear-partida"}>
                {item.category}
              </h3>
              <img
                src={item.photo_category || "/images/Fondos/Example-category.png"}
                alt={item.category}
                className="item-crear-partida"
              />
              {user?.role === 'ADMIN' && (
                <DeleteCategory 
                  id={item.id} 
                  token={token}
                  onDeleted={handleCategoryDeleted}
                />
              )}
            </div>
          );
        })
      ) : (
        <div>No hay categorías disponibles</div>
      )}
    </Slider>
  );
};

export default Carrusel;
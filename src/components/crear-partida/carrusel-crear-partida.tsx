import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import './css/styles.css'
import DeleteCategory from './eliminar-categoria'

interface Category {
  id: number;
  category: string;
  photo_category?: string;
}

interface CarruselProps {
  onSelectCategory: (ids: number[]) => void;
  allCategories: boolean;
  searchQuery: string;
}

const Carrusel: React.FC<CarruselProps> = ({
  onSelectCategory,
  allCategories,
  searchQuery
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [randomGradients, setRandomGradients] = useState<Record<number, string>>({});
  const [role, setRole] = useState('');

  useEffect(() => {
  // Simular un usuario ADMIN
  setRole("ADMIN");

}, []);

  
  // Simulación de categorías (maquetación)
  useEffect(() => {
    const fakeCategories: Category[] = [
      { id: 1, category: "Historia", photo_category: "/images/Fondos/Example-category.png" },
      { id: 2, category: "Ciencia", photo_category: "/images/Fondos/Example-category.png" },
      { id: 3, category: "Deportes", photo_category: "/images/Fondos/Example-category.png" },
      { id: 4, category: "Cultura", photo_category: "/images/Fondos/Example-category.png" },
      { id: 5, category: "Geografía", photo_category: "/images/Fondos/Example-category.png" },
    ];
    setCategories(fakeCategories);
  }, []);

  // Seleccionar todas si allCategories === true
  useEffect(() => {
    if (allCategories) {
      const allIds = categories.map(c => c.id);
      setSelectedCategories(allIds);
      onSelectCategory(allIds);
    } else {
      setSelectedCategories([]);
      onSelectCategory([]);
    }
  }, [allCategories, categories]);

  // Gradientes simulados
  const gradients = [
    "back-purple",
    "back-orange",
    "back-aquamarine",
    "back-blue",
    "back-green",
  ];

  useEffect(() => {
    const newGradients: Record<number, string> = {};
    categories.forEach(cat => {
      const randomIndex = Math.floor(Math.random() * gradients.length);
      newGradients[cat.id] = gradients[randomIndex];
    });
    setRandomGradients(newGradients);
  }, [categories]);

  // Seleccionar o deseleccionar categoría
  const selectCategory = (id: number) => {
    const updated = selectedCategories.includes(id)
      ? selectedCategories.filter(cid => cid !== id)
      : [...selectedCategories, id];

    setSelectedCategories(updated);
    onSelectCategory(updated);
  };

  // Filtrar por búsqueda
  const filteredCategories = categories.filter(cat =>
    cat.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 1500,
    slidesToShow: filteredCategories.length > 0 ? Math.min(4, filteredCategories.length) : 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, filteredCategories.length), slidesToScroll: 1 }
      },
      {
        breakpoint: 767,
        settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true, centerPadding: '0px', adaptiveHeight: true }
      }
    ]
  };

  // Para simulación - datos mock de usuario
  const mockRole = "USER"; // Cambia a "ADMIN" si quieres ver el botón de eliminar

  return (
    <Slider {...settings}>
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
                className="item-crear-partida"
                alt={item.category}
              />
             
              {role === 'ADMIN' && <DeleteCategory id={item.id} token={""} />}
            </div>
          );
        })
      ) : (
        <div className="text-center py-8">
          <p className="text-white">No se encontraron categorías</p>
        </div>
      )}
    </Slider>
  );
};

export default Carrusel;
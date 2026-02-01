import { useState, useEffect, useMemo } from 'react';

const CARRUSEL_GRADIENTS = [
  "back-purple",
  "back-orange",
  "back-aquamarine",
  "back-blue",
  "back-green",
];

export const useCarruselSettings = (items: any[] = []) => { 
  const [randomGradients, setRandomGradients] = useState<Record<string, string>>({});
  
  const safeItems = useMemo(() => {
    return Array.isArray(items) ? items : [];
  }, [items]);

  //  Configuración inicial del slider 
  const [settings, setSettings] = useState({
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 1,
    slidesToShow: safeItems.length > 0 ? 4 : 1, 
    slidesToScroll: 1,
    arrows: true, 
  });

  // Asignar gradientes aleatorios cuando cambien los items
  useEffect(() => {
    if (safeItems.length === 0) return;

    const newGradients: Record<string, string> = {};
    safeItems.forEach((item) => {
      const randomIndex = Math.floor(Math.random() * CARRUSEL_GRADIENTS.length);
      newGradients[item.id] = CARRUSEL_GRADIENTS[randomIndex];
    });

    setRandomGradients(newGradients);
  }, [safeItems]); 


  useEffect(() => {
    const updateSliderSettings = () => {
      if (window.innerWidth <= 767) {
        // En móviles mostrar solo 1 slide
        setSettings(prevSettings => ({
          ...prevSettings,
          slidesToShow: 1,
        }));
      } else {
        // En pantallas grandes mostrar 4 slides
        setSettings(prevSettings => ({
          ...prevSettings,
          slidesToShow: 4,
        }));
      }
    };

    updateSliderSettings(); 
    window.addEventListener('resize', updateSliderSettings);

    return () => {
      window.removeEventListener('resize', updateSliderSettings);
    };
  }, []); 

  return {
    randomGradients,
    sliderSettings: settings,
  };
};
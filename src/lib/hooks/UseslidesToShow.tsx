
import { useState, useEffect } from 'react';

export const useSliderSettings = () => {
  const [settings, setSettings] = useState({
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
  });

  useEffect(() => {
    const updateSettings = () => {
      if (window.innerWidth <= 767) {
        setSettings(prev => ({ ...prev, slidesToShow: 1 }));
      } else {
        setSettings(prev => ({ ...prev, slidesToShow: 3 }));
      }
    };

    updateSettings();
    window.addEventListener('resize', updateSettings);

    return () => {
      window.removeEventListener('resize', updateSettings);
    };
  }, []);

  return settings;
};
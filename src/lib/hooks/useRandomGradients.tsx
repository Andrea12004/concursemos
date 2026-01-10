
import { useState, useEffect } from 'react';

const gradients = [
  "gradient-blue",
  "gradient-purple",
  "gradient-green",
];

export const useRandomGradients = (items: any[]) => {
  const [randomGradients, setRandomGradients] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) return;

    const newGradients: Record<string, string> = {};
    items.forEach((item) => {
      const randomIndex = Math.floor(Math.random() * gradients.length);
      newGradients[item.id] = gradients[randomIndex];
    });
    
    setRandomGradients(newGradients);
  }, [items]);

  return randomGradients;
};
import { useState, useEffect, useRef } from 'react';

interface UseTimerProgressBarProps {
  duration: number;
  onTimeUp?: () => void;
  onTimeUpdate?: (elapsedTime: number) => void;
  resetTimer?: boolean;
}

interface UseTimerProgressBarReturn {
  progress: number;
  timeLeft: number;
  totalDuration: number;
}

export const useTimerProgressBar = ({
  duration,
  onTimeUp,
  onTimeUpdate,
  resetTimer,
}: UseTimerProgressBarProps): UseTimerProgressBarReturn => {
  const [totalDuration, setTotalDuration] = useState(duration);
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [progress, setProgress] = useState(100);

  const timeLeftRef = useRef(timeLeft);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTimerRunning = useRef(false);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Actualizar totalDuration cuando duration cambie
  useEffect(() => {
    if (duration !== null) {
      setTotalDuration(duration);
    }
  }, [duration]);

  // Sincronizar el tiempo restante con useRef
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Sincronizar el progreso de la barra con el tiempo restante
  useEffect(() => {
    const newProgress = (timeLeftRef.current / totalDuration) * 100;
    setProgress(newProgress);
  }, [timeLeft, totalDuration]);

  // Iniciar el temporizador
  const startTimer = () => {
    if (!isTimerRunning.current) {
      isTimerRunning.current = true;
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (onTimeUpdate) {
            onTimeUpdate(totalDuration - newTime);
          }
          if (newTime <= 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            handleTimeUpWithDelay();
          }
          return newTime;
        });
      }, 1000);
    }
  };

  // Función para manejar la finalización del tiempo con un retraso de 2 segundos
  const handleTimeUpWithDelay = () => {
    resetTimeoutRef.current = setTimeout(() => {
      if (onTimeUp) {
        onTimeUp();
      }
    }, 2000);
  };

  // Controlar el reinicio del temporizador sin que se pause innecesariamente
  useEffect(() => {
    if (resetTimer) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      setTimeLeft(totalDuration);
      setProgress(100);
      isTimerRunning.current = false;
    }
  }, [resetTimer, totalDuration]);

  // Iniciar el temporizador si no está en marcha y resetTimer no es true
  useEffect(() => {
    if (!isTimerRunning.current && !resetTimer) {
      startTimer();
    }
  }, [resetTimer]);

  // Limpiar intervalos y timeouts al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      isTimerRunning.current = false;
    };
  }, []);

  return {
    progress,
    timeLeft,
    totalDuration,
  };
};
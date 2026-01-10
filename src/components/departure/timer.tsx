import React, { useState, useEffect, useRef } from 'react';
import './css/time.css'
interface TimerProgressBarProps {
  onTimeUp?: () => void;
  resetTimer?: boolean;
  duration?: number;
  onTimeUpdate?: (elapsedTime: number) => void;
}

export const TimerProgressBar: React.FC<TimerProgressBarProps> = ({ 
  onTimeUp, 
  resetTimer = false, 
  duration = 5, 
  onTimeUpdate 
}) => {
  const [totalDuration, setTotalDuration] = useState<number>(duration);
  const [timeLeft, setTimeLeft] = useState<number>(totalDuration);
  const [progress, setProgress] = useState<number>(100);

  const timeLeftRef = useRef<number>(timeLeft);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTimerRunning = useRef<boolean>(false);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Actualizar duración total si cambia la prop duration
  useEffect(() => {
    if (duration !== null && duration !== undefined) {
      setTotalDuration(duration);
    }
  }, [duration]);

  // Sincronizar tiempo restante con useRef
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Actualizar progreso basado en tiempo restante
  useEffect(() => {
    const newProgress = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
    setProgress(Math.max(0, Math.min(100, newProgress)));
  }, [timeLeft, totalDuration]);

  // Función para iniciar el temporizador
  const startTimer = () => {
    if (!isTimerRunning.current) {
      isTimerRunning.current = true;
      console.log(`⏱️ Timer iniciado: ${totalDuration} segundos`);

      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          
          // Notificar tiempo transcurrido
          if (onTimeUpdate) {
            onTimeUpdate(totalDuration - newTime);
          }

          // Mostrar información de tiempo en consola
          if (newTime <= 5 && newTime > 0) {
            console.log(` Tiempo restante: ${newTime} segundos`);
          }

          // Manejar fin del tiempo
          if (newTime <= 0) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            handleTimeUpWithDelay();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }
  };

  // Función para manejar el fin del tiempo con retraso
  const handleTimeUpWithDelay = () => {
    console.log('⏱️ Tiempo agotado! Ejecutando onTimeUp en 2 segundos...');
    
    resetTimeoutRef.current = setTimeout(() => {
      if (onTimeUp) {
        onTimeUp();
      }
      isTimerRunning.current = false;
    }, 2000);
  };

  // Manejar reinicio del temporizador
  useEffect(() => {
    if (resetTimer) {
      console.log('🔄 Reiniciando timer...');
      
      // Limpiar intervalos y timeouts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }

      // Reiniciar estados
      setTimeLeft(totalDuration);
      setProgress(100);
      isTimerRunning.current = false;
      
      // Reiniciar después de un pequeño delay para evitar conflictos
      const restartTimer = setTimeout(() => {
        startTimer();
      }, 100);

      return () => clearTimeout(restartTimer);
    }
  }, [resetTimer, totalDuration]);

  // Iniciar timer automáticamente al montar o cuando se complete el reinicio
  useEffect(() => {
    if (!isTimerRunning.current && !resetTimer) {
      startTimer();
    }
  }, [resetTimer]);

  // Limpieza al desmontar
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

  // Formatear tiempo para mostrar
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Determinar color de la barra basado en progreso
  const getBarColor = (): string => {
    if (progress > 50) return '#4CAF50'; // Verde
    if (progress > 25) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  };

 return (
    <div style={{textAlign: 'center', height: '100%', width: '100%', position: 'relative', marginTop: '2%'}}>
      <div style={{ position: 'relative', height: '100%', width: '100%', }}>
        {/* Display the progress bar */}
        <div
          style={{
            background: '#C4C4C4',
            width: '100%',
            height: '10px',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <div className='bg-color-bar'
            style={{
              width: `${progress}%`, // Set the width based on the remaining time
              height: '100%',
              transition: 'width 1s linear', // Smooth transition effect for the progress bar
            }}
          />
        </div>
      </div>
          {/* Circle at the front of the progress bar */}
          <div
            style={{
                top: '50%',
              position: 'absolute',
              left: `calc(${progress}% - 15px)`, // Position the circle at the front of the progress
              transform: 'translateY(-50%)',
              width: '30px',
              height: '30px',
              backgroundColor: '#4DFFC4',
              borderRadius: '50%',
              border: '7px solid #FFF', // Circle border color
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)', // Optional shadow for effect
              transition: 'left 1s linear', // Smooth transition for the circle's movement
            }}
          />
    </div>
  );
};

export default TimerProgressBar;

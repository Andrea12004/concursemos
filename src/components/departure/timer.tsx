
import './css/time.css'
import { useTimerProgressBar } from '@/lib/hooks/useTimerProgressBar';

interface TimerProgressBarContainerProps {
  duration: number;
  onTimeUp?: () => void;
  resetTimer?: boolean;
  onTimeUpdate?: (elapsedTime: number) => void;
}

const TimerProgressBar: React.FC<TimerProgressBarContainerProps> = ({
  duration,
  onTimeUp,
  resetTimer,
  onTimeUpdate,
}) => {
  const { progress } = useTimerProgressBar({
    duration,
    onTimeUp,
    resetTimer,
    onTimeUpdate,
  });

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

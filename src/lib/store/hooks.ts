import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook} from 'react-redux';
import type { RootState, AppDispatch } from '@/settings/store';


// Para OBTENER datos del store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Para ENVIAR acciones al store
export const useAppDispatch = () => useDispatch<AppDispatch>();
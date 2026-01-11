// pages/login.tsx - CON INICIALIZACIÓN DE SOCKET DESPUÉS DEL LOGIN
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { setLogin } from '@/lib/store/authSlice';
import { handleLogin } from '@/lib/services/authService';
import { socketManager } from '@/settings/socket';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Hacer login
      const response = await handleLogin(formData);
      
      if (!response) {
        setIsLoading(false);
        return;
      }

      // 2. Guardar en localStorage
      localStorage.setItem('authResponse', JSON.stringify(response));

      // 3. Guardar en Redux
      dispatch(setLogin({
        user: response.user,
        profile: response.profile || response.user.profile,
        token: response.accesToken,
      }));

      // 4. INICIALIZAR SOCKET después del login
      console.log('🔌 Inicializando socket después del login...');
      try {
        await socketManager.initialize();
        console.log('✅ Socket inicializado correctamente');
      } catch (socketError) {
        console.error('⚠️ Error inicializando socket:', socketError);
        // No bloquear el login si falla el socket
      }

      // 5. Redirigir al dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6">Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded disabled:opacity-50"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
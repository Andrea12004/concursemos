import React, { useState} from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Input } from '@/components/UI/Inputs/input';
import '@/css/sendreset.css';
import Button from '@/components/UI/Button/button';
import { handleResetPassword } from '@/lib/services/useSendreset';

// Interfaces
interface FormData {
  email: string;
}

export const Sendreset: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
  });

   const [_isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await handleResetPassword(formData);
      
      if (success) {
        setFormData({ email: '' });
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className='fondo-reset'>
          <div className='div-form-send'>

              <div className='header-form-send'>
                <img src="/images/Logos/Logo-Auth.png" className='logo-img-send'/>
                <div className='div-header-text-send'>
                  <h3 className='h3-class-send'>Reestablecer Contraseña</h3>
                  <p className='descripcion-send'>Escribe tu correo electrónico y te llegará un enlace para que recuperes tu acceso a la plataforma</p>
                </div>
              </div>

              <div className='div-contenido-reset'>
                <form className='form-registro' onSubmit={handleSubmit}>
    
                        <div className='div-input-send'>
                          <Input
                              type="email"
                              placeholder="Ingresa tu correo electronico"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="input2"
                              noFocusRing={true}
                            />
                        </div>
                    <Button type='submit' height='20%'> Recuperar Contraseña</Button>
                </form>
              </div>

          </div>
          <p className='copyraight'>©Copyrigth concursemos 2025</p>
        </div>
    </>
  )
}

export default Sendreset;
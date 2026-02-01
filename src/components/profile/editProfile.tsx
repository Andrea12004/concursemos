
import { Input } from '@/components/UI/Inputs/input';
import './css/styles.css';
import { useEditarPerfilLogic } from '@/lib/services/Profile/useditProfile';

export const EditarPerfil = () => {
  const {
    disable,
    image,
    photoUrl,
    formData,
    handleChange,
    handleSubmit
  }  = useEditarPerfilLogic();

  return (
    <form className='form-editar-perfil' onSubmit={handleSubmit}>
      <div>
        <img 
          src={image || photoUrl || '/images/Logos/Logo-login.png'} 
          alt="Perfil" 
          className='imagen-perfil' 
        />
        <label htmlFor="file">
          <img src="/svg/perfil/foto.svg" alt="Cambiar foto" />
        </label>
        <input 
          type="file" 
          id='file' 
          accept="image/*" 
          name='photo' 
          onChange={handleChange} 
          className='hidden' 
        />
        <div>
          <Input
            type="text"
            placeholder="Usuario"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            width="100%"
            height="40px"
          />
          <Input
            type="text"
            placeholder="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            width="100%"
            height="40px"
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Correo"
            name="email"
            value={formData.email}
            onChange={handleChange}
            width="100%"
            height="40px"
          />
          <Input
            type="text"
            placeholder="Ciudad"
            name="city"
            value={formData.city}
            onChange={handleChange}
            width="100%"
            height="40px"
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Cédula (Opcional)"
            name="cc"
            value={formData.cc}
            onChange={handleChange}
            width="100%"
            height="40px"
          />
          <Input
            type="text"
            placeholder="Género (Opcional)"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            width="100%"
            height="40px"
          />
        </div>
      </div>
      <button 
        type="submit" 
        disabled={disable}
      >
        Actualizar Perfil
      </button>
    </form>
  );
};

export default EditarPerfil;
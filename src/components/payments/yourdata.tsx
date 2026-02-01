
import { Input } from '@/components/UI/Inputs/input';
import { useTusDatosLogic } from '@/lib/services/Payments/useData';
import Pagos from '@/components/modals/pay';
import './css/styles.css'

const TusDatos = () => {
  const {
    formData,
    photo,
    lastPaymentDate,
    nextPaymentDate,
    handleChange,
    confirmCancel,
    user
  } = useTusDatosLogic();

  return (
    <div className="div-tusdatos">
      <div>
        <img
          src={photo || "/images/Logos/Logo-login.png"}
          alt="Foto de perfil"
          className="imagen-perfil-tusdatos"
        />
        <div>
          <Input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="Nombre"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
            disabled
          />
          <Input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
            disabled
          />
        </div>
        <div>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
            disabled
          />
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ciudad"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
            disabled
          />
        </div>
        <div>
          <Input
            type="text"
            name="cc"
            value={formData.cc}
            onChange={handleChange}
            placeholder="Documento"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
            disabled
          />
          <Input
            type="text"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            placeholder="Género"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
            disabled
          />
        </div>
      </div>
      
      <div className="div-datos-operacion">
        <div className="div-plan">
          <div>
            <span>Tu plan se renovará</span>
            <p>{lastPaymentDate ? nextPaymentDate : "Periodo de prueba"}</p>
          </div>
          <img src="/svg/pagos/suscripcion.svg" alt="Suscripción" />
        </div>
        
        <div className="div-plan">
          <div>
            <span>Costo de suscripción</span>
            <p>$20.000</p>
          </div>
          <img src="/svg/pagos/wallet.svg" alt="Wallet" />
        </div>
        
        <div>
          <Pagos />
        </div>
        
        <div className="div-cancelar-suscripcion">
          {user?.role === "BASIC" && ( 
           <button 
              onClick={confirmCancel}
            > Cancelar Suscripción
              <img src="/svg/pagos/cancelar-pago.svg" alt="Cancelar" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TusDatos;
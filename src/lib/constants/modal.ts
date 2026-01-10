import Swal from 'sweetalert2';


interface PartidaData {
  room_name: string;
  room_code: string;
  tipo: string;
  cantidad: string;
  tiempo: string;
  categories?: Array<{ category: string }>;
}

export const showPartidaSuccessModal = (
  partidaData: PartidaData,
  formTipo: string,
  formCantidad: string,
  formTiempo: string
) => {
  Swal.fire({
    title: `<h2 class="text-2xl font-bold font-montserrat text-[#25293D]">${partidaData.room_name}</h2>`,
    html: `
      <div class="text-center font-montserrat text-[#25293D]">
        <div class="text-sm font-medium mb-2 justify-center flex gap-2 flex-wrap items-center">

          <span class="inline-block px-2 py-1 bg-gray-200 rounded flex gap-2 min-w-[150px]">
            <img src="/svg/link/info.svg" alt="Link Icon" class="w-6 h-6">
            Partida ${formTipo}
          </span>

          <span class="inline-block px-2 py-1 bg-gray-200 rounded flex gap-2 min-w-[150px]">
            <img src="/svg/link/info.svg" alt="Link Icon" class="w-6 h-6">
            ${formCantidad} Preguntas
          </span>
          
          <span class="inline-block px-2 py-1 bg-gray-200 rounded flex gap-2 min-w-[150px]">
            <img src="/svg/link/info.svg" alt="Link Icon" class="w-6 h-6">
            ${formTiempo} Segundos
          </span>

          <span class="inline-block px-2 py-1 bg-gray-200 rounded flex gap-2 min-w-[150px] max-w-[500px]">
            <img src="/svg/link/info.svg" alt="Link Icon" class="w-6 h-6">
            ${partidaData.categories ? partidaData.categories.map((item) => item.category).join(', ') : ''}
          </span>
          
        </div>
        <p class="text-lg font-semibold my-4 text-orange-500">Link de la partida</p>
        <div class="flex justify-center items-center gap-2 max-w-lg mx-auto bg-white rounded shadow border border-gray-300 p-2">
          <!-- Icono del link -->
          <img src="/svg/link/url.svg" alt="Link Icon" class="w-6 h-6">
          <!-- Campo de texto con el link -->
          <input
            id="clipboard-input-group"
            type="text"
            class="w-full bg-white border-0 text-[#25293D] focus:outline-none"
            value="https://concursemos.com.co/sala/${partidaData.room_code}"
            readonly
          />
          <!-- Botón de copiar -->
          <button
            type="button"
            class="copy-clipboard flex items-center justify-center bg-white text-blue-600 hover:text-blue-800 transition"
            aria-label="Copy text to clipboard"
            data-clipboard-target="#clipboard-input-group"
            data-clipboard-action="copy"
          >
            <img src="/svg/link/copy.svg" alt="Copy Icon" class="w-6 h-6 copy-clipboard-default">
            <img src="/svg/link/copied.svg" alt="Copied Icon" class="w-6 h-6 hidden copy-clipboard-success">
          </button>
        </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: 'bg-white shadow-lg rounded-lg p-8 w-[800px] max-w-[90%]',
      closeButton: 'absolute top-4 right-4',
    },
    closeButtonHtml: `
      <img
        src="/svg/modals/close.svg"
        alt="Cerrar"
        class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
      />
    `,
    footer: `
      <div class="flex justify-center gap-4 mt-6 font-montserrat">
        <a href="/crear-partida"
          class="px-6 py-3 border border-solid border-[#25293D] hover:border-[#134E9D] text-[#25293D] hover:text-white font-semibold flex gap-2 rounded hover:bg-[#134E9D] transition focus:ring-2 focus:ring-orange-300 iniciar"
        >
            <img
            src="/svg/link/ajustes.svg"
            alt="Cerrar"
            class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform no-hover"
            />

            <img
            src="/svg/link/ajusteshover.svg"
            alt="Cerrar2"
            class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform hover"
            />
          Regresar
        </a>

        <a href="https://concursemos.com.co/sala/${partidaData.room_code}"
          class="px-6 py-3 bg-[#3CEBFF] text-[#25293D] hover:text-white font-semibold flex gap-2 rounded hover:bg-[#FF914C] transition focus:ring-2 focus:ring-blue-300 iniciar"
        >
            <img
            src="/svg/link/cohete.svg"
            alt="Cerrar3"
            class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform no-hover"
            />

            <img
            src="/svg/link/cohetehover.svg"
            alt="Cerrar4"
            class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform hover"
            />
          Iniciar partida
        </a>
      </div>
    `,
    background: '#fff',
    didOpen: () => {
      const clipboards = document.querySelectorAll('.copy-clipboard');
  
      clipboards.forEach((el) => {
            // @ts-ignore
            const clipboard = new ClipboardJS(el as HTMLElement, {
              text: (trigger: HTMLElement) => {
                const clipboardTarget = trigger.dataset.clipboardTarget;
                if (!clipboardTarget) return '';
                
                const targetElement = document.querySelector(clipboardTarget) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
                if (!targetElement) return '';
      
                return targetElement.tagName === 'SELECT' || 
                       targetElement.tagName === 'INPUT' || 
                       targetElement.tagName === 'TEXTAREA'
                  ? targetElement.value
                  : targetElement.textContent || '';
              },
            });
      
            clipboard.on('success', () => {
              const defaultElement = el.querySelector('.copy-clipboard-default');
              const successElement = el.querySelector('.copy-clipboard-success');
      
              if (defaultElement && successElement) {
                defaultElement.classList.add('hidden');
                successElement.classList.remove('hidden');
              }
      
              setTimeout(() => {
                if (defaultElement && successElement) {
                  successElement.classList.add('hidden');
                  defaultElement.classList.remove('hidden');
                }
              }, 3000);
        });
      });
    },
  });
};
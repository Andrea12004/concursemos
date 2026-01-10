/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  /*Todas las variables env*/
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
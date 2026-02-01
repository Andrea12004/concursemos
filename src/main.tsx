import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from "react-router-dom";
import store from '@/settings/store'
import '@/css/global.css'
import axios from 'axios';
import App from '@/App.tsx'

import {baseUrl} from '@/settings/baseUrl.ts'

axios.defaults.baseURL = `${baseUrl}api/`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
          <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

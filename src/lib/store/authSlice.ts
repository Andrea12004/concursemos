import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, Profile } from '@/lib/types/auth';

interface AuthState {
  user: User | null;
  profile: Profile | null;
 
}

const initialState: AuthState = {
  user: null,
  profile: null,
 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {

    setLogin: (
      state,
      action: PayloadAction<{ user: User; profile?: Profile; token: string }>
    ) => {
      state.user = action.payload.user;
      state.profile = action.payload.profile || action.payload.user.profile || null;

    },

    /* ACTUALIZAR PERFIL  */
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },

    /* ACTUALIZAR USUARIO*/
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    /* CERRAR SESIÓN*/
    setLogout: (state) => {
      state.user = null;
      state.profile = null;
    },

    /* RESTORE SESSION - Restaurar sesión desde datos en memoria*/
    restoreSession: (
      state,
      action: PayloadAction<{ user: User; profile?: Profile; token: string }>
    ) => {
      state.user = action.payload.user;
      state.profile = action.payload.profile || null;
    },
  },
});

export const { setLogin, setProfile, setUser, setLogout, restoreSession } =
  authSlice.actions;

export default authSlice.reducer;
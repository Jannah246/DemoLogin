import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../state/auth/authSlice';
import adminReducer from '../state/auth/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminReducer,
  },
});

export default store;

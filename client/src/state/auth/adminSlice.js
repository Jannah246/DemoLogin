import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    adminUsername: '',
  },
  reducers: {
    setAdminUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { setAdminUsername } = authSlice.actions;
export default authSlice.reducer;
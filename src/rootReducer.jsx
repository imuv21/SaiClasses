
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import featSlice from './slices/featSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  feat: featSlice,
});

export default rootReducer;
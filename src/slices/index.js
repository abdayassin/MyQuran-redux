// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
// Importez les slices (tranches) de réducteur nécessaires ici
import surahsReducer from '../features/surahsSlice';
import surahDetailReducer from'../features/SurahDetailSlice'
 
const store = configureStore({
  reducer: {
    surahs: surahsReducer,
    surahSlice: surahDetailReducer, // Incluez le slice surahDetail dans le reducer

  },
});

export default store;

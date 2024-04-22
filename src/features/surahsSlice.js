// src/features/surahsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quranAPI from '../services/quranAPI';

export const fetchAllSurahs = createAsyncThunk(
  'surahs/fetchAllSurahs',
  async () => {
    const response = await quranAPI.get('surah');
    return response.data.data;
  }
);

const surahsSlice = createSlice({
  name: 'surahs',
  initialState: {
    surahs: [],
    favorites: [],
    loading: false,
    error: null,
  },
 
  reducers: {
    // Ajouter une surah aux favoris
    addFavorite: (state, action) => {
      state.favorites.push(action.payload);
    },
    // Supprimer une surah des favoris
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter((number) => number !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSurahs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSurahs.fulfilled, (state, action) => {
        state.loading = false;
        state.surahs = action.payload;
      })
      .addCase(fetchAllSurahs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Exporter les actions et le réducteur
export const { addFavorite, removeFavorite } = surahsSlice.actions;
export default surahsSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../services/quranAPI'; // Assuming axios is in a parent directory
import { getCurrentData, saveData } from '../helpers/localStorage'; // Assuming localStorage helpers are in a parent directory

const initialState = {
  surah: {},
  ayahs: [],
  translations: [],
  translation: 'id.indonesian', // Default translation
  lockView: getCurrentData('_lock_view', '{}').lockView || false, // Default lockView
  loading: true,
  error: null,
};

export const getSurahAndTranslations = createAsyncThunk(
  'surah/getSurahAndTranslations',
  async (numberOfSurah, { getState }) => {
    const { translation } = getState().surahSlice;
    const responses = await Promise.all([
      axios.get(`surah/${numberOfSurah}/ar.alafasy`),
      axios.get(`surah/${numberOfSurah}/en.transliteration`),
      axios.get(`surah/${numberOfSurah}/${translation}`),
      axios.get(`edition/type/translation`),
    ]);
    const [surahData, transliterationData, translationData, translationsData] = responses.map(
      (response) => response.data,
    );

    const mappedSurah = surahData.data.ayahs.map((ayah) => {
      ayah.textInTR = transliterationData.data.ayahs[ayah.numberInSurah - 1].text;
    
      return ayah;
    });

    return { surahData, translationData, translationsData, mappedSurah };
  }
);

export const changeTranslation = createAsyncThunk(
  'surah/changeTranslation',
  async (numberOfSurah, { dispatch, getState }) => {
    const translation = getState().surahSlice.translation;
    const { data: dataInTRL } = await axios.get(`surah/${numberOfSurah}/${translation}`);

    dispatch(updateAyahs(dataInTRL));
  }
);

const surahAndSettingsSlice = createSlice({
  name: 'surahSlice',
  initialState,
  reducers: {
    toggleLockView: (state) => {
      state.lockView = !state.lockView;
      saveData('_lock_view', { lockView: state.lockView });
    },
    updateAyahs: (state, action) => {
      const ayahs = state.surah?.ayahs?.map(ayah => {
        ayah.textInTRL = action.payload?.data?.ayahs[ayah.numberInSurah - 1]?.text;
        return ayah;
      });
      state.ayahs = ayahs;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSurahAndTranslations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSurahAndTranslations.fulfilled, (state, action) => {
        const { surahData, translationData, translationsData, mappedSurah } = action.payload;
        state.surah = surahData.data;
        state.ayahs = mappedSurah;
        state.translations = translationsData;
        state.loading = false;
      })
      .addCase(getSurahAndTranslations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // Handle error (e.g., navigate to home page)
      })
      .addCase(changeTranslation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeTranslation.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changeTranslation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { toggleLockView, updateAyahs } = surahAndSettingsSlice.actions;
export default surahAndSettingsSlice.reducer;

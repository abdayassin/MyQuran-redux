import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSurahs } from '../features/surahsSlice';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import BackToTop from '../components/BackToTop';
import Heading from '../common/Heading';
import Input from '../components/Input';
import SurahCard from '../components/SurahCard';

const Surah = ({ page }) => {
  const dispatch = useDispatch();
  const allSurah = useSelector((state) => state.surahs.surahs);
  const loading = useSelector((state) => state.surahs.loading);
  const favorites = useSelector((state) => state.surahs.favorites);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    dispatch(fetchAllSurahs());
  }, [dispatch, page]);

  const getFavoritesSurah = (surahs) => {
    return surahs.filter(surah => favorites.includes(surah.number));
  };

  const searchSurah = (keyword) => {
    return allSurah.filter(surah => surah.englishName.toLowerCase().includes(keyword) || surah.englishNameTranslation.toLowerCase().includes(keyword));
  };

  const renderSurahs = (surahs) => {
    return surahs.map((surah, i) => (
      <Link to={`/surah/${surah.number}`} key={i} className="hide-tap-color active:outline-none active:ring-2 active:ring-offset-2 active:ring-green-500 rounded transition">
        <SurahCard {...surah} />
      </Link>
    ));
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    const searchedSurah = searchSurah(keyword);
    setKeyword(keyword); // Mettre à jour le mot-clé de recherche
  };

  if (loading) return <Spinner />;

  return (
    <>
      <BackToTop />

      <div className="flex items-stretch sm:items-center justify-between mb-3 sm:mb-5 flex-col sm:flex-row">
        <Heading className="text-xl sm:text-3xl font-bold mb-5 sm:mb-0 text-center">{page === 'home' ? 'Surah' : 'Surah Favorites'}</Heading>
        <Input onKeyUp={handleSearch} withLabel={false} placeholder="Enter a keyword..." nameAndID="keyword" className="w-full sm:w-72" />
      </div>

      {(!loading && !allSurah.length && keyword) && (
        <p className="text-red-500 font-bold py-10 text-center">Surah not found with keyword <span className="text-gray-800">'{keyword}'.</span></p>
      )}

      {(!loading && !allSurah.length && !keyword) && (
        <p className="text-red-500 font-bold py-10 text-center">Surah not found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" id="a">
        {renderSurahs(keyword ? searchSurah(keyword) : allSurah)} {/* Utiliser les résultats de la recherche si un mot-clé est saisi, sinon afficher toutes les surahs */}
      </div>
    </>
  );
};

export default Surah;

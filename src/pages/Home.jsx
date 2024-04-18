// src/pages/Home.jsx
 import React, { useEffect, useState } from 'react';
import BackToTop from '../components/BackToTop'
import quranAPI from "../services/quranAPI";
import Spinner from "../components/Spinner"
import { Link } from 'react-router-dom';
import SurahCard from '../components/SurahCard'
const  Home = () => {
    const [allSurah, setAllSurah] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allSurahInitial, setAllSurahInitial] = useState([]);
    const [keyword, setKeyword] = useState("");
    const getAllSurah = async () => {
        setLoading(true);
        setAllSurah([]);
        let allSurah = (await quranAPI.get(`surah`)).data.data;
          console.log("allSurah",allSurah)
        setAllSurahInitial([...allSurah]); // copy array
        setAllSurah(allSurah);
        setLoading(false);
    }
    useEffect(() => {
        getAllSurah();
        return () => { };
    }, []);
    if (loading) return <Spinner />;
    return (
        <div>
               <BackToTop />
               {(!loading && !allSurah.length && !keyword) && (
                <p className="text-red-500 font-bold py-10 text-center">Surah not found.</p>
            )
            }

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" id="a">
                {allSurah.map((surah, i) => {
                    return (
                        <Link to={`/surah/${surah.number}`} key={i} className="hide-tap-color active:outline-none active:ring-2 active:ring-offset-2 active:ring-green-500 rounded transition">
                            <SurahCard {...surah} />
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

export default Home;

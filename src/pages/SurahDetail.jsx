import Ayah from "../components/Ayah";
import Heading from "../common/Heading";
import { Fragment } from "react";
import {
  ChevronDownIcon,
  PlayIcon,
  RefreshIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/quranAPI";
import Spinner from "../components/Spinner";
import { Menu, Transition } from "@headlessui/react";
import { getLastListenedOfNumberOfSurah } from "../helpers/date";
import Input from "../components/Input";
import { getCurrentData, saveData } from "../helpers/localStorage";
import BackToTop from "../components/BackToTop";
import {
  getSurahAndTranslations,
  changeTranslation,
  toggleLockView,
} from "../features/SurahDetailSlice"; // Remplacer surahSlice par SurahDetailSlice
import { useDispatch, useSelector } from "react-redux";

const countries = {
  id: "Indonesia",
  ar: "Saudi Arabia",
  az: "Azerbaijan",
  bn: "Bangladesh",
  cs: "Czech Republic",
  de: "",
  dv: "Maldives",
  en: "English",
  es: "Mexico",
  fa: "Afghanistan",
  fr: "France",
  ha: "",
  hi: "India",
  it: "Italy",
  ja: "Japan",
  ko: "South Korea",
  ku: "Iraq",
  ml: "Mali",
  nl: "The Netherlands",
  no: "Norway",
  pl: "Poland",
  pt: "São Tomé and Príncipe",
  ro: "Romania",
  ru: "Russia",
  sd: "Sudan",
  so: "Somalia",
  sq: "Albania",
  sv: "Sweden",
  sw: "",
  ta: "Sri Lanka",
  tg: "Tajikistan",
  th: "Thailand",
  tr: "Turkey",
  tt: "Trinidad and Tobago",
  ug: "",
  ur: "Pakistan",
  uz: "Uzbekistan",
  zh: "China",
};

export default function SurahDetail() {
  const tr = getCurrentData("_translation", "{}");
  const [translation, setTranslation] = useState(
    tr?.translation || "id.indonesian"
  );
  const params = useParams();
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(1);
  const dispatch = useDispatch();

  const { surah, ayahs, translations, lockView, loading, error } = useSelector(
    (state) => state.surahSlice);
    console.log(ayahs)
  useEffect(() => {
    dispatch(getSurahAndTranslations(params.number));
  }, [dispatch, params.number]);
  useEffect(() => {
    dispatch(changeTranslation(params.number));
}, [dispatch, params.number, translation]);

 
  if (loading) return <Spinner />;

  return (
    <>
      <BackToTop />
      <div className="flex items-stretch md:items-center justify-between mb-3 md:mb-5 flex-col md:flex-row pt-5">
        <Heading className="text-xl sm:text-3xl font-bold mb-5 md:mb-0 text-center flex items-center gap-5">
          Surah {surah.englishName}
          <button
            className="rounded-full text-green-500 h-9 w-9"
            onClick={() => {
              document.querySelectorAll(".murottals-audio").forEach((el, i) => {
                el.pause();
                if (i == 0) {
                  el.play();
                }
              });
            }}
          >
            <PlayIcon />
          </button>
          <button
            className="rounded-full h-9 w-9 text-green-500"
            title="Toogle lock 
                    view while playing audio."
            onClick={() => {
              setLockView(!lockView);
            }}
          >
            {lockView ? <LockClosedIcon /> : <LockOpenIcon />}
          </button>
        </Heading>
        <Menu as="div" className="relative inline-block text-left">
  <div>
    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded">
      Translation : {countries[translation.split(".")[0]]} ~{" "}
      {translations && Array.isArray(translations.data)
        ? translations.data.map((tr) =>
            tr.identifier === translation ? tr.englishName : ""
          )
        : ""}
      <ChevronDownIcon
        className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
        aria-hidden="true"
      />
    </Menu.Button>
  </div>
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y 
    divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="px-1 py-1 max-h-96 overflow-y-auto">
        {translations.data.map((translation, i) => (
          <Menu.Item key={i}>
            <button
              className="bg-white text-gray-900 group flex hover:bg-gray-50 items-center w-full px-2 py-2 text-sm text-left"
              onClick={(e) => {
                setTranslation(e.target.dataset.identifier);
                let tr = getCurrentData("_translation", "{}");
                tr.translation = e.target.dataset.identifier;
                saveData("_translation", tr);
              }}
              data-identifier={translation.identifier}
            >
              {countries[translation.language] || "Unknown"} ~ {translation.englishName}
            </button>
          </Menu.Item>
        ))}
      </div>
    </Menu.Items>
  </Transition>
</Menu>

      </div>

      <div className="p-5 bg-white rounded grid grid-cols-1 sm:grid-cols-3 gap-2 font-bold text-base mb-4">
        <span>
          Surah to :{" "}
          <span className="text-green-500 block">{surah.number}</span>
        </span>
        <span>
          English Name Translation :{" "}
          <span className="text-green-500 block">{surah.englishName}</span>
        </span>
        <span>
          Arabic Name :{" "}
          <span className="text-green-500 block">{surah.name}</span>
        </span>
      </div>
      <div className="p-5 bg-white rounded grid grid-cols-1 sm:grid-cols-3 gap-2 font-bold text-base mb-4">
        <span>
          Total Ayahs :{" "}
          <span className="text-green-500 block">{surah.numberOfAyahs}</span>
        </span>
        <span>
          Revelation Type :{" "}
          <span className="text-green-500 block">{surah.revelationType}</span>
        </span>
        <span>
          Last Listened :{" "}
          <span className="text-green-500 block">
            {getLastListenedOfNumberOfSurah(params.number) || "-"}
          </span>
        </span>
      </div>
      <div className="flex justify-between grid grid-cols-3 sm:grid-cols-3 gap-20 font-bold text-base mb-4 items-center">
        <Input
          style={{ width: "50%" }}
          type="number"
          labelText="Start From"
          min={1}
          max={surah.numberOfAyahs - 1}
          value={min}
          className="w-full"
          onChange={(e) => setMin(Number(e.target.value))}
        />
        <Input
          style={{ width: "50%" }}
          type="number"
          labelText="End"
          min={min + 1}
          max={surah.numberOfAyahs}
          value={max}
          className="w-full"
          onChange={(e) => setMax(Number(e.target.value))}
        />
        <button
          className="h-9 w-9 text-green-500 mt-5 ml-2"
          onClick={() => {
            setMin(1);
            setMax(Number(surah?.numberOfAyahs));
          }}
          title="Reset to default start and end of Ayah."
        >
          <RefreshIcon />
        </button>
      </div>
      <div className="space-y-10">
      {ayahs &&
    Array.isArray(ayahs) &&
    ayahs.map((ayah, i) => {
      return (
        <Ayah
          key={i}
          lockView={lockView}
          ayah={ayah}
          numberOfSurah={params.number} // Passer le paramètre numberOfSurah ici
        />
      );
    })}
</div>

    </>
  );
}

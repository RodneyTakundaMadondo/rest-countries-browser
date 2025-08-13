// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react'
import { MoonLoader } from 'react-spinners';
import { Link } from 'react-router-dom'

// const AreaContext = useContext();
export default function Home(props) {
    const [regionDropDown, setRegionDropDown] = useState(false);
    const [data, setData] = useState(null);
    const regionsArr = ["Africa", "America", "Asia", "Europe", "Oceania"];
    const [region, setRegion] = useState(null);
    const [activeOption, setActiveOption] = useState(null);
    let [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                let endpoint = 'https://restcountries.com/v3.1/all';
                if (searchTerm) {
                    // endpoint = `https://restcountries.com/v3.1/name/${searchTerm}`
                    let query = searchTerm.trim();
                    endpoint = `https://restcountries.com/v3.1/name/${query}?fullText=true`;
                }
                if (region && !searchTerm) {
                    endpoint = `https://restcountries.com/v3.1/region/${region}`;
                }

                const res = await fetch(`${endpoint}?fields=name,languages,borders,capital,region,subregion,flags,population,tld,currencies`);
                if (!res.ok) {
                    setData(null);
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                else {
                    const json = await res.json();

                    setData(json);
                    setLoading(false);
                }


            } catch (err) {
                console.error('Fetch failed:', err);
            }
        };
        fetchData();
    }, [region, searchTerm])

    function handleSearch(e) {
        e.preventDefault();
        setSearchTerm(inputValue);
    }

    function handleRegionStuff(reg) {
        setRegion(reg === "America" ? "Americas" : reg)
        setSearchTerm(null);
    }

    return (

        <main className="space-y-8">
            <section className='lg:px-4'>
                <div className="flex flex-col lg:flex-row lg:justify-between  px-6 gap-16 lg:w-[min(100%,85rem)] lg:mx-auto lg:px-0 ">
                    <div className=" w-[min(calc(100%),30rem)]">
                        <form className="relative " action="">
                            <button
                                onClick={handleSearch}
                            >
                                <i className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 left-6  text-[var(--grey-400)]"></i>
                            </button>
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="rod-shadow px-16 py-4 dark:bg-[var(--blue-900)] dark:placeholder:text-[var(--grey-50)]  rounded w-full dark:text-white  focus:outline-0 placeholder:text-[var(--grey-400)] placeholder:opacity-50" type="text" name="search-country" id="search-country" placeholder="Search for a country..." />
                        </form>
                    </div>

                    <div className="relative w-[min(100%,15rem)] min-w-[10.4rem] p-4 rounded-md bg-white dark:bg-[var(--blue-900)] rod-shadow flex justify-between dark:text-white ">
                        <span className='font-semibold'>Filter by Region</span>
                        <button
                            onClick={() => { setRegionDropDown(prev => !prev) }}
                        >
                            <i className={`fa-solid fa-chevron-${regionDropDown ? "up" : "down"}`}></i>
                        </button>
                        <ul className={`rod-shadow absolute rounded-md z-50 left-0 space-y-2 -bottom-2 translate-y-full  flex-col w-full p-4  bg-white dark:bg-[var(--blue-900)] ${regionDropDown ? "flex" : "hidden"} regions-filter`}>
                            {
                                regionsArr.map((reg, index) => (
                                    <li key={index} onClick={() => { setActiveOption(reg) }} className={`p-2 ${activeOption === reg ? "rod-shadow font-bold" : ""}`}>
                                        <button
                                            className='w-full text-start'
                                            onClick={() => { handleRegionStuff(reg) }}
                                        >{reg}
                                        </button></li>
                                ))
                            }

                        </ul>
                    </div>
                </div>
            </section>
            <section className='lg:px-4'>
                {
                    loading ?
                        <div className='flex justify-center min-h-[20rem] items-center'>
                            <MoonLoader />
                        </div>
                        :
                        <div className="bod-grid px-0 grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  w-[min(100%,85rem)] mx-auto ">
                            {
                                data ?
                                    data.map((countryInfo, index) => (
                                        <Link to={`/details/${countryInfo.name.common}`} key={index} onClick={() => { props.setAreaInfo(countryInfo) }} className={`card rod-shadow rounded-md w-[min(calc(100%-2rem),30rem)] xl:w-auto  max-h-[348px] dark:bg-[var(--blue-900)] `}>

                                            <div className="country-flag w-full h-[12.5rem] overflow-hidden flex items-center justify-center rounded-tl-md rounded-tr-md ">
                                                <img className=' w-full h-full object-center object-cover' src={countryInfo.flags.svg} alt="" />
                                            </div>

                                            <div className='p-6 dark:text-white'>
                                                <h3 className={`font-bold ${countryInfo.name.common.length > 10 ? "text-sm" : "text-lg"}`}>{countryInfo.name.common}</h3>
                                                <ul className='country-info'>
                                                    <li>
                                                        <span>Population:</span>
                                                        <span>{countryInfo.population}</span>
                                                    </li>
                                                    <li>
                                                        <span>Region:</span>
                                                        <span>{countryInfo.region}</span>
                                                    </li>
                                                    <li>
                                                        <span>
                                                            Capital:
                                                        </span>
                                                        <span>{countryInfo.capital ? countryInfo.capital[0] : "no data"}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </Link>
                                    )) :
                                    ""
                            }
                        </div>
                }
                {data ? "" : <p className='  text-center dark:text-white font-bold text-2xl'>
                    Oops! We couldn’t find that country. Try another one?
                </p>}
            </section>
        </main>
       
    )
}

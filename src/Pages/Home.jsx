// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useRef } from 'react'
import { MoonLoader } from 'react-spinners';
import { Link } from 'react-router-dom'

export default function Home(props) {
    const [regionDropDown, setRegionDropDown] = useState(false);
    const [data, setData] = useState(null);
    const regionsArr = ["All", "Africa", "America", "Asia", "Europe", "Oceania"];
    const [region, setRegion] = useState(null);
    const [activeOption, setActiveOption] = useState(null);
    let [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [inputValue, setInputValue] = useState("");
    const dropDownRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;



    const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;
    const currentItems = data ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];
    // Pagination Variables
    const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visibleCount = 5;
    const [startIndex, setStartIndex] = useState(0);

    const handleClick = (index) => {
        // const globalIndex = startIndex + index;

        // Calculate new start index so that clicked number is "positioned" appropriately
        let newStart = startIndex;

        if (index === visibleCount - 2) {
            // second-to-last clicked → slide forward 1
            newStart = Math.min(startIndex + 1, numbers.length - visibleCount);
        } else if (index === visibleCount - 1) {
            // last clicked → slide forward 2
            newStart = Math.min(startIndex + 2, numbers.length - visibleCount);
        } else if (index === 1) {
            // second button → slide backward 1
            newStart = Math.max(startIndex - 1, 0);
        } else if (index === 0) {
            // first button → slide backward 2
            newStart = Math.max(startIndex - 2, 0);
        }

        setStartIndex(newStart);
    };

    const visibleNumbers = numbers.slice(startIndex, startIndex + visibleCount)
    //Pagination Variables


    function handlePagination(number, index) {
        setCurrentPage(number);
        handleClick(index)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let endpoint = 'https://restcountries.com/v3.1/all';
                if (searchTerm) {
                    // endpoint = `https://restcountries.com/v3.1/name/${searchTerm}`
                    let query = searchTerm.trim();
                    endpoint = `https://restcountries.com/v3.1/name/${query}?fullText=true`;
                }
                if (region && !searchTerm && region !== "All") {
                    endpoint = `https://restcountries.com/v3.1/region/${region}`;
                } else if (region == "All") {
                    endpoint = "https://restcountries.com/v3.1/all";
                }

                const res = await fetch(`${endpoint}?fields=name,languages,borders,capital,region,subregion,flags,population,tld,currencies`);
                if (!res.ok) {
                    setData(null);
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                else {
                    const json = await res.json();

                    setData(json);
                    console.log(json);
                    setLoading(false);
                }


            } catch (err) {
                console.error('Fetch failed:', err);
            }
        };
        fetchData();
    }, [region, searchTerm])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setRegionDropDown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    function handleSearch(e) {
        e.preventDefault();
        setRegion("")
        setSearchTerm(inputValue);
        setActiveOption(null)
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

                    <div
                        ref={dropDownRef}
                        onClick={() => { setRegionDropDown(prev => !prev) }}
                        className="relative w-[min(100%,15rem)] min-w-[10.4rem] p-4 rounded-md bg-white dark:bg-[var(--blue-900)] rod-shadow flex justify-between dark:text-white hover:cursor-pointer ">
                        <span className='font-semibold'>Filter by Region</span>
                        <button
                        >
                            <i className={`fa-solid fa-chevron-${regionDropDown ? "up" : "down"}`}></i>
                        </button>
                        <ul className={`rod-shadow absolute rounded-md z-50 left-0 space-y-2 -bottom-2 translate-y-full  flex-col w-full p-4  bg-white dark:bg-[var(--blue-900)] ${regionDropDown ? "flex" : "hidden"} regions-filter`}>
                            {
                                regionsArr.map((reg, index) => (
                                    <li key={index} onClick={() => { setActiveOption(reg) }} className={`p-2 ${activeOption === reg ? "rod-shadow font-bold" : ""} hover:bg-[#2b7fff] `}>
                                        <button
                                            className='w-full text-start hover:cursor-pointer'
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
                        setTimeout(() => (
                            <div className='flex justify-center min-h-[20rem] items-center'>
                                <MoonLoader />
                            </div>
                        ), 3000)
                        :
                        <div className="bod-grid px-0 grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  w-[min(100%,85rem)] mx-auto ">
                            {
                                currentItems ?
                                    currentItems.map((countryInfo, index) => (
                                        <Link to={`/details/${countryInfo.name.common}`} key={index} onClick={() => { props.setAreaInfo(countryInfo) }} className={`card cursor-pointer hover:-translate-y-2 duration-300 transition-all rod-shadow rounded-md w-[min(calc(100%-2rem),30rem)]   max-h-[348px] dark:bg-[var(--blue-900)] `}>

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
            <section className='mb-4 px-4'>
                <div className='flex justify-center gap-2 dark:text-white'>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage(prev => {
                                const newPage = Math.max(prev - 1, 1);

                                // If you moved to the first button in the visible slice, slide window backward
                                const indexInVisible = visibleNumbers.indexOf(newPage);
                                handleClick(indexInVisible);

                                return newPage;
                            });
                        }}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div className='flex justify-center gap-4 '>
                        {
                            visibleNumbers.map((number, index) => (
                                <button
                                    className={` border-solid border-2 border-[var(--grey-400)] transition duration-300 ease-in-out rounded-full h-10 w-10 pagin-btn ${currentPage === number ? "active" : ""}`}
                                    key={index}
                                    onClick={() => { handlePagination(number, index) }}
                                >
                                    {number}
                                </button>
                            ))
                        }
                    </div>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => {
                            setCurrentPage(prev => {
                                const newPage = Math.min(prev + 1, totalPages);

                                // If you moved to the last button in the visible slice, slide window forward
                                const indexInVisible = visibleNumbers.indexOf(newPage);
                                handleClick(indexInVisible);

                                return newPage;
                            });
                        }}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

            </section>
        </main>

    )
}


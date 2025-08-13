/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom'
export function Detail(props) {
    const [data, setData] = useState(null);
    const [borderingCountries, setBorderingCountries] = useState();
    const myParam = useParams();

    const areaInfo = data ? data.filter(country => country.name.common == myParam.countryName)[0] : null;
    const borderCodes = areaInfo?.borders || [];

    const currencyObj = areaInfo ? Object.values(areaInfo.currencies)[0] : null;
    let langObj = areaInfo ? Object.values(areaInfo.languages) : null;


    useEffect(() => {
        const fetchData = async () => {
            try {
                let endpoint = 'https://restcountries.com/v3.1/all';

                const res = await fetch(`${endpoint}?fields=name,languages,borders,capital,region,subregion,flags,population,tld,currencies`);
                if (!res.ok) {
                    setData(null);
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                else {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error('Fetch failed:', err);
            }
        };
        fetchData();
    }, [])

    console.log(areaInfo ? areaInfo : "")

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!borderCodes || borderCodes.length === 0) return;
                const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}`)
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const json = await res.json();

                setBorderingCountries(json);

            } catch (err) {
                console.error('Fetch failed:', err);
            }

        }
        fetchData();
    }, [borderCodes])

    return (
        <section className="px-4">
            {
                areaInfo ?
                    <div className="flex flex-col gap-8 pb-8">

                        <Link to="/" className="text-black dark:bg-[var(--blue-900)] dark:text-white rod-shadow  py-2 px-6  rounded-md mr-auto flex items-center gap-2" ><i className="fa-solid fa-arrow-left"></i>Back</Link>

                        <div className="flex flex-col gap-8 lg:flex-row">

                            <div
                                className="w-[min(100%,40rem)] h-[400px] shadow-sm  mx-auto lg:mx-0 "

                            >
                                <img className="w-full h-full object-contain" src={areaInfo.flags.svg} alt={areaInfo.flags.alt} />
                            </div>


                            <div className="space-y-8 lg:py-20  w-[min(100%,45rem)] mx-auto lg:mx-0 lg:ml-auto ">
                                <h1 className="font-extrabold lg:px-4 lg:text-3xl dark:text-white text-xl">{areaInfo.name.common}</h1>
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:px-4 gap-4 " >
                                    <div className="space-y-4">
                                        <ul className="country-detail">
                                            <li className="dark:!text-[var(--grey-400)]"><span className="dark:!text-white">Native Name:</span>{areaInfo.name.official}</li>
                                            <li className="dark:!text-[var(--grey-400)]"><span className="dark:!text-white">Population:</span>{areaInfo.population.toLocaleString()}</li>
                                            <li className="dark:!text-[var(--grey-400)]"><span className="dark:!text-white">Region:</span>{areaInfo.region}</li>
                                            <li className="dark:!text-[var(--grey-400)]"><span className="dark:!text-white">Sub Region:</span>{areaInfo.subregion}</li>
                                            <li className="dark:!text-[var(--grey-400)]"><span className="dark:!text-white">Capital:</span>{areaInfo.capital ? areaInfo.capital.join(", ") : "N/A"}</li>
                                        </ul>
                                    </div>

                                    <div className="lg:w-[min(100%,20rem)]">
                                        <ul className="country-detail">
                                            <li className="dark:!text-[var(--grey-400)]"><span className="dark:!text-white">Top Level Domain:</span>{areaInfo.tld ? areaInfo.tld : "N/A"}</li>
                                            <li className="dark:!text-[var(--grey-400)]"><span className="dark:!text-white">Currencies:</span>{currencyObj.name}</li>
                                            <li className="dark:!text-[var(--grey-400)]"><span className="dark:!text-white">Languages:</span>{langObj.join(", ")}</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-2 lg:px-4 lg:flex lg:items-center lg:gap-8 ">
                                    <p className="font-semibold text-nowrap dark:!text-white">Border Countries:</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {
                                            borderingCountries ?
                                                borderingCountries.map((name, index) => (
                                                    <span className="block rounded-md py-2 px-3 rod-shadow dark:text-white" key={index}>{name.name.common}</span>
                                                )) : <span className=" dark:text-white">
                                                    N/A
                                                </span>
                                        }
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div> : ""
            }
        </section>

    )
}
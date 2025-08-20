import { useState, useEffect } from 'react';
import { CiLight } from "react-icons/ci";
export function Header() {
    const [darkMode, setDarkMode] = useState(false);
    const [themeStatus, setThemeStatus] = useState("")
    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            setThemeStatus("Light Mode")
        } else {
            root.classList.remove("dark");
            setThemeStatus("Dark Mode")
        }
    }, [darkMode])

    return (
        <header className="px-4 py-6 bg-white shadow-md dark:bg-[var(--blue-900)] ">
            <nav className="flex justify-between flex-wrap w-[min(100%,85rem)] mx-auto dark:text-white ">
                <h1 className="font-black">
                    Where in the world?
                </h1>

                <button
                    onClick={() => { setDarkMode(prev => !prev) }}
                    className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95">
                    {
                        themeStatus === "Light Mode" ?
                            <CiLight /> : <span><i className="fa-regular   fa-moon"></i></span>
                    }
                    <span className="font-semibold">
                        {themeStatus}
                    </span>
                </button>

            </nav>
        </header>
    )
}
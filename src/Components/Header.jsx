import { useState, useEffect } from 'react'
export function Header() {
    const [darkMode, setDarkMode] = useState(false);
    useEffect(()=>{
        const root = document.documentElement;
        if(darkMode){
            root.classList.add("dark");

        }else{
            root.classList.remove("dark");
        }
    },[darkMode])

    return (
        <header className="px-4 py-6 bg-white shadow-md dark:bg-[var(--blue-900)] ">
            <nav className="flex justify-between flex-wrap w-[min(100%,85rem)] mx-auto dark:text-white ">
                <h1 className="font-black">
                    Where in the world?
                </h1>
            
                <button
                    onClick={() => { setDarkMode(prev => !prev) }}
                    className="flex gap-2 transition-transform duration-200 hover:scale-105 active:scale-95">
                    <span><i className="fa-regular   fa-moon"></i></span>
                    <span className="font-semibold">
                        Dark Mode
                    </span>
                </button>

            </nav>
        </header>
    )
}
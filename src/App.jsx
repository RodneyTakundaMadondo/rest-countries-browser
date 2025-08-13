import { Header } from "./Components/Header";
import Home from "./Pages/Home";
import { Detail } from "./Pages/Detail";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
export function App() {
    // const [currentPage, setCurrentPage] = useState("Body");
    const [areaInfo, setAreaInfo] = useState(null);

  
    return (

        <BrowserRouter>
            <Routes>
                <Route element={<Layout />} >
                    <Route path="/" element={<Home setAreaInfo={setAreaInfo} />} />
                    <Route path="/details/:countryName" element={<Detail areaInfo={areaInfo} />} />
                </Route>
            </Routes>
        </BrowserRouter>

    )
}
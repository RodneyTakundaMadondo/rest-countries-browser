import { Header } from "./Header"
import { Outlet } from "react-router-dom"
export default function Layout() {
    return (
        <>
            <div className="space-y-8">
                <Header />
                <Outlet />
            </div>
        </>
    )
}
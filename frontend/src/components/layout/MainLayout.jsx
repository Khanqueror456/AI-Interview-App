import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

import React from 'react'

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout

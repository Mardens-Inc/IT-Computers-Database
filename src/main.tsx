import React from 'react'
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import $ from 'jquery'
import {NextUIProvider} from "@nextui-org/react";

import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";

import "./assets/scss/index.scss"
import Home from "./assets/pages/Home.tsx";
import ThemeSwitcher, {applyTheme} from "./assets/components/ThemeSwitcher.tsx";

applyTheme()

ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <PageContent/>
        </BrowserRouter>
    </React.StrictMode>,
)


function PageContent() {
    const navigate = useNavigate();
    return (
        <NextUIProvider navigate={navigate}>
            <Nav/>
            <Routes>
                <Route>
                    <Route path="/" element={<Home/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}


function Nav() {
    return (
        <Navbar>
            <NavbarContent>
                <NavbarBrand>
                    <p className="font-bold text-inherit">IT Computers Database</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
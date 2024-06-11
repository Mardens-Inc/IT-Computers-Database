import React from 'react'
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import {Input, NextUIProvider} from "@nextui-org/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import ThemeSwitcher, {applyTheme} from "./assets/components/ThemeSwitcher.tsx";
import {SearchIcon} from "./assets/components/Icons.tsx";
import {ComputersTable} from "./assets/pages/ComputersTable.tsx";
import $ from 'jquery'

import "./assets/scss/index.scss"

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
    const [search, setSearch] = React.useState<string>("");
    return (
        <NextUIProvider navigate={navigate}>
            <Nav onSearch={setSearch}/>
            <Routes>
                <Route>
                    <Route path="/" element={<ComputersTable search={search}/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}


interface NavProps {
    onSearch: (value: string) => void,
}

function Nav({onSearch}: NavProps) {
    return (
        <Navbar className="max-w-full">
            <NavbarContent>
                <NavbarBrand>
                    <p className="font-bold text-inherit">IT Computers Database</p>
                </NavbarBrand>
            </NavbarContent>

            <Input placeholder="Type to search..." startContent={<SearchIcon size={16}/>} type="search" size="sm" classNames={{base: "max-w-full sm:max-w-[10rem h-10"}} onInput={(e) => {
                onSearch(e.currentTarget.value);
            }}/>

            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

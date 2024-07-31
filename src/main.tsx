import React from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import ReactDOM from "react-dom/client";
import {NextUIProvider} from "@nextui-org/react";
import {applyTheme} from "./assets/components/ThemeSwitcher.tsx";
import {ComputersTable} from "./assets/pages/ComputersTable.tsx";
import $ from "jquery";

import "./assets/scss/index.scss";

applyTheme();

ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <PageContent/>
        </BrowserRouter>
    </React.StrictMode>
);


function PageContent()
{
    const navigate = useNavigate();
    return (
        <NextUIProvider navigate={navigate}>
            <Routes>
                <Route>
                    <Route path="/" element={<ComputersTable/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}

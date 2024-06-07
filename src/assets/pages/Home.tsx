import {Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import {getCurrentTheme, Themes} from "../components/ThemeSwitcher.tsx";
import React, {useEffect, useState} from 'react';
import $ from "jquery"

export default function Home() {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableColumn>Id</TableColumn>
                    <TableColumn>Make</TableColumn>
                    <TableColumn>OS</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Location</TableColumn>
                    <TableColumn>User</TableColumn>
                    <TableColumn> </TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Hello</TableCell>
                        <TableCell>Hello</TableCell>
                        <TableCell>Hello</TableCell>
                        <TableCell>Hello</TableCell>
                        <TableCell>Hello</TableCell>
                        <TableCell>Hello</TableCell>
                        <TableCell className="w-1"><Tooltip content="View more information"><Button><Eye/></Button></Tooltip></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
}


function Eye() {
    const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
    useEffect(() => {
        const themeChangeListener = (_event: JQuery.TriggeredEvent, theme: Themes | ((prevState: Themes) => Themes)) => {
            setCurrentTheme(theme)
        }

        $(window).on('themeChange', themeChangeListener);

        return () => {
            $(window).off('themeChange', themeChangeListener);
        }
    }, [])
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="16px">
            <path fill={currentTheme === Themes.light ? "#000000" : "#ffffff"} d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/>
        </svg>
    );
}

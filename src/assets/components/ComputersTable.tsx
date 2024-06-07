import {Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {getCurrentTheme, Themes} from "./ThemeSwitcher.tsx";
import $ from "jquery";

export function ComputersTable() {

    const [data, setData] = useState<Computer[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await $.get("https://computers.mardens.com/api/?limit=10");
            console.log(response)
            setData(response);
        };

        fetchData();
    }, []);
    return (
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
            {(data === null) ? <TableBody><TableRow></TableRow></TableBody> : <TableBody>{data.map((computer) => (
                <TableRow key={computer.id}>
                    <TableCell>{computer.id}</TableCell>
                    <TableCell>{computer.make}</TableCell>
                    <TableCell>{computer.operating_system}</TableCell>
                    <TableCell>{computer.type}</TableCell>
                    <TableCell>{computer.location}</TableCell>
                    <TableCell>{computer.primary_user}</TableCell>
                    <TableCell>
                        <Tooltip content="View Details">
                            <Button><Eye/></Button>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            ))}</TableBody>}
        </Table>
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

type Computer = {
    id: string,
    asset_number: string,
    make: string,
    model: string,
    condition: number,
    location: string,
    primary_user: string,
    operating_system: string,
    type: number,
    available: number,
    specs: Object,
    notes: string,
    creation_date: Date,
    last_update: Date
};
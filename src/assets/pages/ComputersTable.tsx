import {Button, getKeyValue, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure} from "@nextui-org/react";
import React, {useCallback, useEffect, useState} from "react";
import {AsyncListData, useAsyncList} from "@react-stately/data";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {DeleteIcon, EditIcon, EyeIcon} from "../components/Icons.tsx";
import ComputerPopup, {EditMode} from "../components/ComputerPopup.tsx";

export function ComputersTable({search = ""}) {

    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    // update the search query when the search prop changes
    useEffect(() => {
        list.reload();
    }, [search]);

    const fetchAndProcessData = async (url: string, signal: AbortSignal, cursor: string | number | undefined) => {
        if (cursor) {
            setIsLoading(false);
        }
        const response = await fetch(url, {signal});
        const json = await response.json();

        setHasMore(json.page < json.last_page);

        // map the type to a string
        json.data.forEach((item: Computer) => {
            item.type = GetComputerType(item.type as number);
            item.available = item.available === 0;
        });
        setIsLoading(false);
        return {
            items: json.data as Computer[],
            cursor: json.page + 1
        };
    };

    const list: AsyncListData<Computer> = useAsyncList({
        async load({signal, cursor}) {
            const url = `http://computers.local/api/?limit=30&page=${cursor ?? 0}&query=${search}`;
            return fetchAndProcessData(url, signal, cursor);
        },
        async sort({sortDescriptor, signal, cursor}) {
            const ascending = sortDescriptor.direction === 'ascending';
            const column = sortDescriptor.column?.toString() ?? "id";
            const url = `http://computers.local/api/?limit=10&page=${cursor ?? 0}${ascending ? "&ascending" : ""}&sort=${column}&query=${search}`;
            return fetchAndProcessData(url, signal, cursor);
        }
    });

    const [loaderRef, scrollerRef] = useInfiniteScroll({hasMore, onLoadMore: list.loadMore});

    const [loadedComputerPopup, setLoadedComputerPopup] = useState<{ computer: Computer | null, mode: EditMode }>({computer: null, mode: EditMode.Add});
    const disclosure = useDisclosure();
    const modal = (<ComputerPopup computer={loadedComputerPopup.computer} mode={loadedComputerPopup.mode} disclosure={disclosure}/>)

    useEffect(() => {
        if (loadedComputerPopup && disclosure.isOpen && loadedComputerPopup.computer) {
            disclosure.onOpen();
        }
    }, [loadedComputerPopup]);

    // Create a callback for opening the modal with a computer object
    const handleModalOpen = useCallback((computer: Computer | null, mode: EditMode) => {
        // Set the selected computer
        setLoadedComputerPopup({
            computer: computer,
            mode: mode
        });

        // Open the modal
        disclosure.onOpen();
    }, [disclosure]);

    return (
        <>
            {modal}
            <Table isStriped isHeaderSticky removeWrapper baseRef={scrollerRef} onSortChange={list.sort} sortDescriptor={list.sortDescriptor} bottomContent={hasMore ? (
                <div className="flex w-full justify-center">
                    <Spinner ref={loaderRef} color="primary" size={"lg"}/>
                </div>) : null}
                   classNames={{
                       base: "max-h-[90vh] overflow-auto m-auto w-[95vw]",
                       table: "min-h-[32px]",
                   }}>
                <TableHeader>
                    <TableColumn allowsSorting allowsResizing key="asset_number">Id</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="make">Make</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="operating_system">OS</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="type">Type</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="location">Location</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="primary_user">User</TableColumn>
                    <TableColumn allowsResizing key="actions" className="flex align-middle justify-end">
                        <Tooltip content={"Add new device"}>
                            <Button color="primary" className="aspect-square w-[2rem] min-w-[2rem] min-h-[2rem] h-[2rem] rounded-md m-0.5" onClick={() => handleModalOpen(null, EditMode.Add)}>+</Button>
                        </Tooltip>
                    </TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={"No computers found."}
                    isLoading={isLoading}
                    items={list.items}
                    loadingContent={<Spinner ref={loaderRef} color="primary" size={"lg"}/>}
                >
                    {(item: Computer) => (
                        <TableRow key={item.id} aria-label={`Row for asset number ${item.asset_number}`}>
                            {(columnKey) => columnKey === "actions" ? (<TableCell><ActionsRow
                                onView={() => handleModalOpen(item, EditMode.View)}
                                onEdit={() => handleModalOpen(item, EditMode.Edit)}/></TableCell>) : (<TableCell>{getKeyValue(item, columnKey)}</TableCell>)}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

function ActionsRow({onView, onEdit, onDelete}: { onView?: () => void, onEdit?: () => void, onDelete?: () => void }) {
    return (
        <div className="relative flex items-center gap-2 justify-end">
            <Tooltip content="Details" closeDelay={0}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={onView} aria-label={"Click to view the device's details"}>
                <EyeIcon/>
              </span>
            </Tooltip>
            <Tooltip content="Edit" closeDelay={0}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={onEdit} aria-label={"Click to modify the device's details"}>
                <EditIcon/>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete" closeDelay={0}>
              <span className="text-lg text-danger cursor-pointer active:opacity-50" aria-label={"Click to remove device from the database."} onClick={onDelete}>
                <DeleteIcon/>
              </span>
            </Tooltip>
        </div>
    );
}

export type Computer = {
    id: string,
    asset_number: string,
    make: string,
    model: string,
    condition: number,
    location: string,
    primary_user: string,
    operating_system: string,
    type: string | number,
    available: boolean | number,
    specs: any,
    notes: string,
    creation_date: Date,
    last_update: Date
};


/**
 * Returns the computer type based on the given type code.
 * @param {number} type - The type code representing the computer type.
 * @return {string} - The computer type as a string.
 */
export function GetComputerType(type: number): string {
    switch (type) {
        case 1:
            return "Laptop";
        case 2:
            return "Desktop";
        case 3:
            return "Printer";
        case 4:
            return "Copier";
        case 5:
            return "Phone";
        case 6:
            return "Kiosk";
        case 7:
            return "Tablet";
        default:
            return "Unknown";
    }
}

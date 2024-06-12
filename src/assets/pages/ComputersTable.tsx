import {Button, getKeyValue, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure} from "@nextui-org/react";
import React, {useCallback, useEffect, useState} from "react";
import {AsyncListData, AsyncListStateUpdate, useAsyncList} from "@react-stately/data";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {DeleteIcon, EditIcon, EyeIcon} from "../components/Icons.tsx";
import ComputerPopup, {EditMode} from "../components/ComputerPopup.tsx";
import {Confirm} from "../components/AlertComponent.tsx";
import {Computer, ComputerSearchOptions, GetComputers, GetComputerType} from "../ts/ComputerManager.ts";

export function ComputersTable({search = ""}) {

    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    // update the search query when the search prop changes
    useEffect(() => {
        list.reload();
    }, [search]);

    const fetchAndProcessData = async (options: ComputerSearchOptions, signal: AbortSignal, cursor: string | number | undefined): Promise<AsyncListStateUpdate<Computer, string>> => {
        // setIsLoading(true);
        if (cursor) {
            setIsLoading(false);
        }

        const json = await GetComputers(options, signal);
        if (json == null)
            return {
                items: [],
                cursor: '0'
            };

        setHasMore(json.page < json.last_page);

        // map the type to a string
        json.data.forEach((item: Computer) => {
            item.type = GetComputerType(item.type as number);
            item.available = item.available === 0;
        });
        setIsLoading(false);
        return {
            items: json.data,
            cursor: (json.page + 1).toString()
        };
    };

    const list: AsyncListData<Computer> = useAsyncList({
        async load({signal, cursor}) {
            console.log(`Cursor: ${cursor}`)
            let page = parseInt(cursor ?? '0');
            page = isNaN(page) ? 0 : page;
            return fetchAndProcessData({limit: 30, page, query: search, sort: 'id', ascending: false}, signal, cursor);
        },
        async sort({sortDescriptor, signal, cursor}) {
            const ascending = sortDescriptor.direction === 'ascending';
            const column = sortDescriptor.column?.toString() ?? "id";
            let page = parseInt(cursor ?? '0');
            page = isNaN(page) ? 0 : page;

            return fetchAndProcessData({limit: 10, page, query: search, sort: column, ascending: ascending}, signal, cursor);
        }
    });

    const [loaderRef, scrollerRef] = useInfiniteScroll({hasMore, onLoadMore: list.loadMore});

    const [loadedComputerPopup, setLoadedComputerPopup] = useState<{ computer: Computer | null, mode: EditMode }>({computer: null, mode: EditMode.Add});
    const [deletingComputerPopup, setIsDeletingPopup] = useState<Computer | null>(null)
    const editViewDisclosure = useDisclosure();
    const deleteDisclosure = useDisclosure();
    const modal = (<ComputerPopup computer={loadedComputerPopup.computer} mode={loadedComputerPopup.mode} disclosure={editViewDisclosure}/>)

    useEffect(() => {
        if (loadedComputerPopup && editViewDisclosure.isOpen && loadedComputerPopup.computer) {
            editViewDisclosure.onOpen();
        }
    }, [editViewDisclosure, loadedComputerPopup]);

    useEffect(() => {
        if (deletingComputerPopup) {
            deleteDisclosure.onOpen();
        }
    }, [deleteDisclosure, deletingComputerPopup]);

    // Create a callback for opening the modal with a computer object
    const handleModalOpen = useCallback((computer: Computer | null, mode: EditMode) => {
        // Set the selected computer
        setLoadedComputerPopup({
            computer: computer,
            mode: mode
        });

        // Open the modal
        editViewDisclosure.onOpen();
    }, [editViewDisclosure]);

    const handleDeleteComponentPopup = useCallback((computer: Computer | null) => {
        // Set the selected computer
        setIsDeletingPopup(computer);
        // Open the modal
        deleteDisclosure.onOpen();
    }, [deleteDisclosure]);


    const confirmDeleteModal = (<Confirm confirmButtonText={"DELETE!"} onClose={(value) => {
        if (value) console.log('delete');
    }} message={"Are you sure you want to delete this device, this cannot be undone"} type={"warning"} closeButtonText={"Keep"} disclosure={deleteDisclosure}/>)


    return (
        <>
            {confirmDeleteModal}
            {modal}
            <Table isStriped isHeaderSticky removeWrapper baseRef={scrollerRef} onSortChange={list.sort} sortDescriptor={list.sortDescriptor} bottomContent={hasMore ? (
                <div className="flex w-full justify-center">
                    <Spinner ref={loaderRef} color="primary" size={"lg"}/>
                </div>) : null}
                   classNames={{
                       base: "max-h-[90vh] overflow-auto m-auto w-[95vw] min-h-[64px]",
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
                                onEdit={() => handleModalOpen(item, EditMode.Edit)}
                                onDelete={() => handleDeleteComponentPopup(item)}
                            /></TableCell>) : (<TableCell>{getKeyValue(item, columnKey)}</TableCell>)}
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

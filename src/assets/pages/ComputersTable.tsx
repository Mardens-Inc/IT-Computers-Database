import {Button, getKeyValue, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure} from "@nextui-org/react";
import React, {useCallback, useEffect, useState} from "react";
import {AsyncListData, AsyncListStateUpdate, useAsyncList} from "@react-stately/data";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {CopyIcon, DeleteIcon, EditIcon, EyeIcon} from "../components/Icons.tsx";
import ComputerPopup, {EditMode} from "../components/ComputerPopup.tsx";
import {Confirm} from "../components/AlertComponent.tsx";
import {Computer, ComputerSearchOptions, DeleteComputer, GetComputers} from "../ts/ComputerManager.ts";
import FilterComputerPopup, {FilterResults} from "../components/FilterComputerPopup.tsx";

export function ComputersTable()
{
    // let filter: FilterResults = {};
    const [filter, setFilter] = useState<FilterResults>({});
    let currentSortDescriptor: SortDescriptor = {column: "last_update", direction: "descending"};
    const pageSize = 80;
    const list: AsyncListData<Computer> = useAsyncList({
        async load({signal, cursor})
        {
            console.log(`loading table with cursor position of '${cursor}' and a search query of '${filter.query}'`);
            let page = parseInt(cursor ?? "0");
            page = isNaN(page) ? 0 : page;
            const ascending = currentSortDescriptor.direction === "ascending";
            const column = currentSortDescriptor.column?.toString() ?? "last_update";

            return fetchAndProcessData({limit: pageSize, page, query: filter.query ?? "", sort: column, ascending: ascending, filter: filter}, signal, cursor);
        },
        async sort({sortDescriptor, signal, cursor})
        {
            console.log(`sorting table column '${sortDescriptor.column}' ${sortDescriptor.direction ? "ascending" : "descending"}`);
            currentSortDescriptor = sortDescriptor;
            const ascending = sortDescriptor.direction === "ascending";
            const column = sortDescriptor.column?.toString() ?? "last_update";
            let page = parseInt(cursor ?? "0");
            page = isNaN(page) ? 0 : page;

            return fetchAndProcessData({limit: pageSize, page, query: filter.query ?? "", sort: column, ascending: ascending, filter: filter}, signal, cursor);
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [loaderRef, scrollerRef] = useInfiniteScroll({hasMore, onLoadMore: list.loadMore});
    const [loadedComputerPopup, setLoadedComputerPopup] = useState<{ computer: Computer, mode: EditMode }>({computer: {} as Computer, mode: EditMode.Add});
    const [deletingComputerPopup, setIsDeletingPopup] = useState<Computer | null>(null);
    const editViewDisclosure = useDisclosure();
    const deleteDisclosure = useDisclosure();
    const modal = (<ComputerPopup computer={loadedComputerPopup.computer} mode={loadedComputerPopup.mode} disclosure={editViewDisclosure} onAddOrUpdate={() =>
    {
        list.reload();
        editViewDisclosure.onClose();
    }}/>);


    // Create a callback for opening the modal with a computer object
    const handleModalOpen = useCallback((computer: Computer, mode: EditMode) =>
    {
        // Set the selected computer
        setLoadedComputerPopup({
            computer: computer,
            mode: mode
        });

        // Open the modal
        editViewDisclosure.onOpen();
    }, [editViewDisclosure]);


    const handleDeleteComponentPopup = useCallback((computer: Computer) =>
    {
        // Set the selected computer
        setIsDeletingPopup(computer);
        // Open the modal
        deleteDisclosure.onOpen();
    }, [deleteDisclosure]);


    const confirmDeleteModal = (<Confirm confirmButtonText={"DELETE!"} onClose={(value) =>
    {
        if (value)
        {
            console.log(`delete ${deletingComputerPopup?.id}`);
            DeleteComputer(deletingComputerPopup?.id as string).then(() =>
            {
                list.reload();
                setIsDeletingPopup(null);
                deleteDisclosure.onClose();
            });
        }
    }} message={"Are you sure you want to delete this device, this cannot be undone"} type={"warning"} closeButtonText={"Keep"} disclosure={deleteDisclosure}/>);


    const fetchAndProcessData = async (options: ComputerSearchOptions, signal: AbortSignal | undefined, cursor: string | number | undefined): Promise<AsyncListStateUpdate<Computer, string>> =>
    {
        if (cursor) setIsLoading(false);

        const json = await GetComputers(options, signal);
        if (json == null)
            return {
                items: [],
                cursor: "0"
            };

        setHasMore(false);
        // setHasMore(json.page < json.last_page);

        setIsLoading(false);
        return {
            items: json.data,
            cursor: (json.page + 1).toString()
        };
    };

    return (
        <div className={"flex flex-row mt-4"}>
            {confirmDeleteModal}
            {modal}
            <FilterComputerPopup filter={filter} onApplyFilter={f =>
            {
                setFilter(f);
                console.log(`Filter`, filter);
                list.reload();
            }}/>
            <Table className={"w-full"} isStriped isHeaderSticky removeWrapper baseRef={scrollerRef} onSortChange={list.sort} sortDescriptor={list.sortDescriptor} bottomContent={hasMore ? (
                <div className="flex w-full justify-center">
                    <Spinner ref={loaderRef} color="primary" size={"lg"}/>
                </div>) : null}
                   classNames={{
                       base: "max-h-[98vh] overflow-auto mr-5 min-h-[64px]",
                       table: "min-h-[32px]"
                   }}>
                <TableHeader>
                    <TableColumn allowsSorting allowsResizing key="asset_number">Id</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="make">Make</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="operating_system">OS</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="type">Type</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="location">Location</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="primary_user">User</TableColumn>
                    <TableColumn allowsSorting allowsResizing key="last_update">Last Updated</TableColumn>
                    <TableColumn allowsResizing key="actions" className="flex align-middle justify-end">
                        <Tooltip content={"Add new device"}>
                            <Button color="primary" className="h-[1.75rem] rounded-md m-0.5 my-auto text-lg" onClick={() => handleModalOpen({} as Computer, EditMode.Add)}>+</Button>
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
                                onDuplicate={() => handleModalOpen(item, EditMode.Duplicate)}
                            /></TableCell>) : (<TableCell>{getKeyValue(item, columnKey).toString()}</TableCell>)}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function ActionsRow({onView, onEdit, onDelete, onDuplicate}: { onView?: () => void, onEdit?: () => void, onDelete?: () => void, onDuplicate?: () => void })
{
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
            <Tooltip content="Duplicate" closeDelay={0}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={onDuplicate} aria-label={"Click to duplicate the device's details"}>
                <CopyIcon/>
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

import {cn, Input, Select, SelectItem, Switch} from "@nextui-org/react";
import {uniqueFields} from "../ts/unique-fields.ts";
import React from "react";
import {SearchIcon} from "./Icons.tsx";
import ThemeSwitcher from "./ThemeSwitcher.tsx";

/**
 * Represents the props for the ComputerPopup component.
 */
interface FilterComputerPopupProps
{
    filter: FilterResults;
    onApplyFilter: (filterResults: FilterResults) => void;

}

export interface FilterResults
{
    query?: string
    make?: string,
    model?: string,
    location?: string,
    primary_user?: string,
    operating_system?: string,
    type?: string,
    condition?: string
    available?: boolean
}


export default function FilterComputerPopup({filter, onApplyFilter}: FilterComputerPopupProps)
{

    return (
        <div className={"flex flex-col px-3 max-h-[80vh]"}>
            <div className={"flex flex-row mx-3 mb-4"}>
                <h2 className={"w-full text-3xl mx-3 mb-4"}>Filters</h2>
                <ThemeSwitcher/>
            </div>
            <div className={"w-[500px] mx-2 flex flex-col gap-2"}>
                <Input label={"Search"} placeholder="Type to search..." startContent={<SearchIcon size={16}/>} type="search" onInput={(e) =>
                {
                    filter.query = e.currentTarget.value;
                    onApplyFilter(filter);
                }}/>
                <Select
                    label={"Type"}
                    placeholder={"Filter by type..."}
                    aria-label={"filter by type."}
                    onSelectionChange={(keys) =>
                    {
                        filter.type = [...keys][0] as string;
                        onApplyFilter(filter);
                    }}>
                    <SelectItem key="1">Laptop</SelectItem>
                    <SelectItem key="2">Desktop</SelectItem>
                    <SelectItem key="3">Printer</SelectItem>
                    <SelectItem key="4">Copier</SelectItem>
                    <SelectItem key="5">Phone</SelectItem>
                    <SelectItem key="6">Kiosk</SelectItem>
                    <SelectItem key="7">Tablet</SelectItem>
                    <SelectItem key="0">Unknown</SelectItem>
                </Select>
                <Select
                    label={"Condition"}
                    placeholder="Filter by condition"
                    aria-label={"The condition of device."}
                    onSelectionChange={(keys) =>
                    {
                        filter.condition = [...keys][0] as string;
                        onApplyFilter(filter);
                    }}>
                    <SelectItem key="1">Broken</SelectItem>
                    <SelectItem key="2">Good/Used</SelectItem>
                    <SelectItem key="3">Refurbished / Open Box</SelectItem>
                    <SelectItem key="4">Display</SelectItem>
                    <SelectItem key="5">New</SelectItem>
                    <SelectItem key="0">Unknown</SelectItem>
                </Select>
                <Select
                    label={"Operating System"}
                    aria-label={"Computers operating system"}
                    placeholder="Filter by operating system"
                    onSelectionChange={(keys) =>
                    {
                        filter.operating_system = [...keys][0] as string;
                        onApplyFilter(filter);
                    }}>
                    {uniqueFields.operating_system.map((os) => <SelectItem key={os} aria-label={`Operating System: ${os}`}>{os}</SelectItem>)}
                </Select>
                <Select
                    label={"Make"}
                    aria-label={"Computer make or brand"}
                    placeholder="Filter by make"
                    onSelectionChange={(keys) =>
                    {
                        filter.make = [...keys][0] as string;
                        onApplyFilter(filter);
                    }}>
                    {uniqueFields.make.map((make) => <SelectItem key={make} aria-label={`Make: ${make}`}>{make}</SelectItem>)}
                </Select>
                <Select
                    label={"Model"}
                    aria-label={"Computer model or serial number"}
                    placeholder={"Filter by model"}
                    onSelectionChange={(keys) =>
                    {
                        filter.model = [...keys][0] as string;
                        onApplyFilter(filter);
                    }}>
                    {uniqueFields.model.map((model) => <SelectItem key={model} aria-label={`Model: ${model}`}>{model}</SelectItem>)}
                </Select>
                <Select
                    label={"Location"}
                    aria-label={"The location of the device"}
                    placeholder={"Filter by location"}
                    onSelectionChange={(keys) =>
                    {
                        filter.location = [...keys][0] as string;
                        onApplyFilter(filter);
                    }}>
                    {uniqueFields.location.map((location) => <SelectItem key={location} aria-label={`Model: ${location}`}>{location}</SelectItem>)}
                </Select>
                <Select
                    label={"Primary User"}
                    aria-label={"The primary user of the device"}
                    placeholder={"Filter by primary user"}
                    onSelectionChange={(keys) =>
                    {
                        filter.primary_user = [...keys][0] as string;
                        onApplyFilter(filter);
                    }}>
                    {uniqueFields.primary_user.map((user) => <SelectItem key={user} aria-label={`Model: ${user}`}>{user}</SelectItem>)}
                </Select>
                <Switch
                    defaultSelected={false}
                    onValueChange={
                        value =>
                        {
                            filter.available = value;
                            onApplyFilter(filter);
                        }
                    }
                    classNames={{
                        base: cn(
                            "inline-flex flex-row-reverse min-w-[100%] bg-content1 hover:bg-content2 items-center",
                            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                            "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn("w-6 h-6 border-2 shadow-lg",
                            "group-data-[hover=true]:border-primary",
                            //selected
                            "group-data-[selected=true]:ml-6",
                            // pressed
                            "group-data-[pressed=true]:w-7",
                            "group-data-[selected]:group-data-[pressed]:ml-4"
                        )
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-medium">Available</p>
                        <p className="text-tiny text-default-400">
                            If enabled, only available computers will be shown.
                        </p>
                    </div>
                </Switch>
            </div>
        </div>
    );
}


//
// export default function FilterComputerPopup({disclosure, currentFilter, onApplyFilter}: FilterComputerPopupProps)
// {
//     const {isOpen, onOpenChange} = disclosure;
//     // eslint-disable-next-line prefer-const
//     let [filterResults, setFilterResults] = useState<FilterResults>({});
//     filterResults = currentFilter
//
//     console.log(filterResults);
//     return (
//         <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="min-w-[500px] w-[25vw] max-w-[800px]">
//             <ModalContent>
//                 {(onClose) => (
//                     <>
//                         <ModalHeader className="flex flex-col gap-1">Filter Computer</ModalHeader>
//                         <ModalBody className="flex flex-col min-w-[100%] overflow-y-auto max-h-[70vh]">
//                             <Table hideHeader removeWrapper aria-label={"The device's information."}>
//                                 <TableHeader>
//                                     <TableColumn>Name</TableColumn>
//                                     <TableColumn>Value</TableColumn>
//                                 </TableHeader>
//                                 <TableBody>
//                                     <TableRow>
//                                         <TableCell>Type</TableCell>
//                                         <TableCell>
//                                             <Select
//                                                 placeholder={"Filter by type..."}
//                                                 aria-label={"filter by type."}
//                                                 onSelectionChange={(keys) =>
//                                                 {
//                                                     setFilterResults({...filterResults, type: [...keys][0] as string});
//                                                 }}>
//                                                 <SelectItem key="1">Laptop</SelectItem>
//                                                 <SelectItem key="2">Desktop</SelectItem>
//                                                 <SelectItem key="3">Printer</SelectItem>
//                                                 <SelectItem key="4">Copier</SelectItem>
//                                                 <SelectItem key="5">Phone</SelectItem>
//                                                 <SelectItem key="6">Kiosk</SelectItem>
//                                                 <SelectItem key="7">Tablet</SelectItem>
//                                                 <SelectItem key="0">Unknown</SelectItem>
//                                             </Select>
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell>Condition</TableCell>
//                                         <TableCell>
//                                             <Select
//                                                 placeholder="Filter by condition"
//                                                 aria-label={"The condition of device."}
//                                                 onSelectionChange={(keys) =>
//                                                 {
//                                                     setFilterResults({...filterResults, condition: [...keys][0] as string});
//                                                 }}>
//                                                 <SelectItem key="1">Broken</SelectItem>
//                                                 <SelectItem key="2">Good/Used</SelectItem>
//                                                 <SelectItem key="3">Refurbished / Open Box</SelectItem>
//                                                 <SelectItem key="4">Display</SelectItem>
//                                                 <SelectItem key="5">New</SelectItem>
//                                                 <SelectItem key="0">Unknown</SelectItem>
//                                             </Select>
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell>Operating System </TableCell>
//                                         <TableCell>
//                                             <Select
//                                                 aria-label={"Computers operating system"}
//                                                 placeholder="Filter by operating system"
//                                                 onSelectionChange={(keys) =>
//                                                 {
//                                                     setFilterResults({...filterResults, operating_system: [...keys][0] as string});
//                                                 }}>
//                                                 {uniqueFields.operating_system.map((os) => <SelectItem key={os} aria-label={`Operating System: ${os}`}>{os}</SelectItem>)}
//                                             </Select>
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell>Make </TableCell>
//                                         <TableCell>
//                                             <Select
//                                                 aria-label={"Computer make or brand"}
//                                                 placeholder="Filter by make"
//                                                 onSelectionChange={(keys) =>
//                                                 {
//                                                     setFilterResults({...filterResults, make: [...keys][0] as string});
//                                                 }}>
//                                                 {uniqueFields.make.map((make) => <SelectItem key={make} aria-label={`Make: ${make}`}>{make}</SelectItem>)}
//                                             </Select>
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell>Model</TableCell>
//                                         <TableCell>
//                                             <Select
//                                                 aria-label={"Computer model or serial number"}
//                                                 placeholder={"Filter by model"}
//                                                 onSelectionChange={(keys) =>
//                                                 {
//                                                     setFilterResults({...filterResults, model: [...keys][0] as string});
//                                                 }}>
//                                                 {uniqueFields.model.map((model) => <SelectItem key={model} aria-label={`Model: ${model}`}>{model}</SelectItem>)}
//                                             </Select>
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell>Location </TableCell>
//                                         <TableCell>
//                                             <Select
//                                                 aria-label={"The location of the device"}
//                                                 placeholder={"Filter by location"}
//                                                 onSelectionChange={(keys) =>
//                                                 {
//                                                     setFilterResults({...filterResults, location: [...keys][0] as string});
//                                                 }}>
//                                                 {uniqueFields.location.map((location) => <SelectItem key={location} aria-label={`Model: ${location}`}>{location}</SelectItem>)}
//                                             </Select>
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell>Primary User </TableCell>
//                                         <TableCell>
//                                             <Select
//                                                 aria-label={"The primary user of the device"}
//                                                 placeholder={"Filter by primary user"}
//                                                 onSelectionChange={(keys) =>
//                                                 {
//                                                     setFilterResults({...filterResults, primary_user: [...keys][0] as string});
//                                                 }}>
//                                                 {uniqueFields.primary_user.map((user) => <SelectItem key={user} aria-label={`Model: ${user}`}>{user}</SelectItem>)}
//                                             </Select>
//                                         </TableCell>
//                                     </TableRow>
//                                     <TableRow>
//                                         <TableCell>Availability</TableCell>
//                                         <TableCell className="flex justify-end">
//                                             <Switch defaultSelected={false} onValueChange={value => setFilterResults({...filterResults, available: value})}/>
//                                         </TableCell>
//                                     </TableRow>
//                                 </TableBody>
//                             </Table>
//                         </ModalBody>
//                         <ModalFooter>
//                             <Button onClick={onClose} color={"danger"} variant={"light"}>Cancel</Button>
//                             <Button onClick={() =>
//                             {
//                                 const copy: FilterResults = {...filterResults};
//                                 filterResults = {};
//                                 onApplyFilter(copy);
//                             }} color={"primary"}>Apply Filter</Button>
//                         </ModalFooter>
//                     </>
//                 )}
//             </ModalContent>
//         </Modal>
//     );
// }
//

import {Computer} from "../pages/ComputersTable.tsx";
import {Autocomplete, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea} from "@nextui-org/react";
import {uniqueFields} from "../ts/unique-fields.ts";
import {useState} from "react";

interface ComputerPopupProps {
    computer: Computer | null;
    mode: EditMode;
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
        onOpenChange: () => void;
    };
}

export enum EditMode {
    Edit,
    View,
    Add
}

export default function ComputerPopup({computer, mode, disclosure}: ComputerPopupProps) {
    const {isOpen, onOpenChange} = disclosure;
    const [isLoading, setIsLoading] = useState(false);
    const edit = mode === EditMode.Edit || mode === EditMode.Add;

    const specKeys = ["RAM", "CPU", "Storage", "GPU", "Display", "Benchmark", "IP Address", "Department", "Login", "Password", "TV ID"];

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="min-w-[500px] w-[25vw] max-w-[800px]">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{mode === EditMode.Edit ? "Edit" : mode === EditMode.Add ? "Add" : "View"} Computer</ModalHeader>
                        <ModalBody className="flex flex-col min-w-[100%] overflow-y-auto max-h-[70vh]">
                            <Table hideHeader removeWrapper aria-label={"The device's information."}>
                                <TableHeader>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn>Value</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {mode !== EditMode.Add && (
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>{computer?.id}</TableCell>
                                        </TableRow>
                                    )}
                                    {mode !== EditMode.Add && (
                                        <TableRow>
                                            <TableCell>Created</TableCell>
                                            <TableCell>{computer?.creation_date.toString()}</TableCell>
                                        </TableRow>
                                    )}
                                    {mode !== EditMode.Add && (
                                        <TableRow>
                                            <TableCell>Last Updated</TableCell>
                                            <TableCell>{computer?.last_update.toString()}</TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell>Asset Number <span className={"text-danger"}>*</span> </TableCell>
                                        <TableCell>{edit ? (<Input aria-label={"The asset number of the device"} value={computer?.asset_number} placeholder={"This field is required..."}/>) : computer?.asset_number}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Type <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Select placeholder={mode === EditMode.Add ? "This field is required..." : computer?.type.toString()} aria-label={"The type of device that this is."}>
                                                <SelectItem key="1">Laptop</SelectItem>
                                                <SelectItem key="2">Desktop</SelectItem>
                                                <SelectItem key="3">Printer</SelectItem>
                                                <SelectItem key="4">Copier</SelectItem>
                                                <SelectItem key="5">Phone</SelectItem>
                                                <SelectItem key="6">Kiosk</SelectItem>
                                                <SelectItem key="7">Tablet</SelectItem>
                                                <SelectItem key="0">Unknown</SelectItem>
                                            </Select>) : computer?.type}

                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Operating System <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete aria-label={"Computers operating system"} placeholder={mode === EditMode.Add ? "This field is required..." : computer?.operating_system.toString()}>
                                                {uniqueFields.operating_system.map((os) => <SelectItem key={os} aria-label={`Operating System: ${os}`}>{os}</SelectItem>)}
                                            </Autocomplete>) : computer?.operating_system.toString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Make <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete aria-label={"Computer make or brand"} placeholder={mode === EditMode.Add ? "This field is required..." : computer?.make.toString()}>
                                                {uniqueFields.make.map((make) => <SelectItem key={make} aria-label={`Make: ${make}`}>{make}</SelectItem>)}
                                            </Autocomplete>) : computer?.make.toString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Model</TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete aria-label={"Computer model or serial number"} placeholder={mode === EditMode.Add ? "This field is optional..." : computer?.model.toString()}>
                                                {uniqueFields.model.map((model) => <SelectItem key={model} aria-label={`Model: ${model}`}>{model}</SelectItem>)}
                                            </Autocomplete>) : computer?.model.toString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Location <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete aria-label={"The location of the device"} placeholder={mode === EditMode.Add ? "This field is required..." : computer?.location.toString()}>
                                                {uniqueFields.location.map((location) => <SelectItem key={location} aria-label={`Model: ${location}`}>{location}</SelectItem>)}
                                            </Autocomplete>) : computer?.location.toString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Primary User <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete aria-label={"The primary user of the device"} placeholder={mode === EditMode.Add ? "This field is required..." : computer?.primary_user.toString()}>
                                                {uniqueFields.primary_user.map((user) => <SelectItem key={user} aria-label={`Model: ${user}`}>{user}</SelectItem>)}
                                            </Autocomplete>) : computer?.primary_user.toString()}
                                        </TableCell>
                                    </TableRow>
                                    {computer?.specs && Object.keys(computer.specs).map((key) => {
                                        return (
                                            <TableRow key={key}>
                                                <TableCell className="capitalize">{key.replace(/_/g, " ")}</TableCell>
                                                <TableCell>{edit ? (<Input aria-label={`The ${key} of the device`} placeholder={key} value={computer.specs[key]}/>) : computer.specs[key]}</TableCell>
                                            </TableRow>
                                        );

                                    })}
                                    {mode === EditMode.Add && specKeys.map((key) => {
                                        return (
                                            <TableRow key={key}>
                                                <TableCell>{key}</TableCell>
                                                <TableCell>
                                                    <Input aria-label={`The ${key} of the device`} placeholder={"This field is optional..."}/>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    <TableRow>
                                        <TableCell>Notes</TableCell>
                                        <TableCell>
                                            <Textarea aria-label={"Any additional notes about the device"} placeholder={"Any notes that might be important"} value={computer?.notes}/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Availability</TableCell>
                                        <TableCell className="flex justify-end">
                                            <Switch isDisabled={!edit} value={computer?.available.toString()}/>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </ModalBody>
                        {edit ? (

                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose} isDisabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={() => {
                                    if (isLoading) return;
                                    setIsLoading(true);
                                    setTimeout(() => setIsLoading(false), 5000);
                                }}>
                                    {isLoading ? (<Spinner color={"white"} size={"sm"}/>) : "Save"}
                                </Button>
                            </ModalFooter>
                        ) : (

                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        )}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
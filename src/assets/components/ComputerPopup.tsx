import {Autocomplete, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea} from "@nextui-org/react";
import {uniqueFields} from "../ts/unique-fields.ts";
import {useState} from "react";
import {AddComputer, Computer, GetComputerConditionCode, GetComputerTypeCode, UpdateComputer} from "../ts/ComputerManager.ts";

/**
 * Represents the props for the ComputerPopup component.
 */
interface ComputerPopupProps
{
    computer: Computer;
    mode: EditMode;
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
        onOpenChange: () => void;
    };
    onAddOrUpdate: (computer: Computer) => void;
}

/**
 * Enum representing the possible edit modes.
 *
 * @enum {number}
 */
// eslint-disable-next-line react-refresh/only-export-components
export enum EditMode
{
    Edit,
    View,
    Add,
    Duplicate
}

export default function ComputerPopup({computer, mode, disclosure, onAddOrUpdate}: ComputerPopupProps)
{
    const {isOpen, onOpenChange} = disclosure;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks,prefer-const
    let [newComputer, setNewComputer] = useState<Computer>(computer);
    const edit = mode === EditMode.Edit || mode === EditMode.Add || mode === EditMode.Duplicate;
    const specKeys = ["RAM", "CPU", "Storage", "GPU", "Display", "Benchmark", "IP Address", "Department", "Login", "Password", "TV ID"];

    if (!newComputer || Object.keys(newComputer).length === 0)
        newComputer = computer;

    const isMissingRequiredFields = !newComputer.asset_number || !newComputer.type || !newComputer.condition || !newComputer.operating_system || !newComputer.make || !newComputer.location || !newComputer.primary_user;

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="min-w-[500px] w-[25vw] max-w-[800px]">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{mode === EditMode.Edit ? "Edit" : mode === EditMode.Add ? "Add" : mode === EditMode.Duplicate ? "Duplicate" : "View"} Computer</ModalHeader>
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
                                        <TableCell>Asset Number <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>{edit ? (<Input aria-label={"The asset number of the device"} value={newComputer?.asset_number} placeholder={"This field is required..."} isRequired errorMessage={"This field is required"} onValueChange={(e) =>
                                        {
                                            setNewComputer({...newComputer, asset_number: e} as Computer); // This is a workaround to prevent the newComputer object from being null.
                                        }}/>) : newComputer?.asset_number}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Type <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Select placeholder={mode === EditMode.Add ? "This field is required..." : newComputer?.type.toString()} aria-label={"The type of device that this is."} onSelectionChange={(keys) =>
                                            {
                                                const items = [...keys] as string[];
                                                if (items.length > 0)
                                                {
                                                    try
                                                    {
                                                        setNewComputer({...newComputer, type: parseInt(items[0])} as Computer);
                                                    } catch (e)
                                                    {
                                                        setNewComputer({...newComputer, type: 0} as Computer);
                                                        console.error(e);
                                                    }
                                                } else
                                                {
                                                    setNewComputer({...newComputer, type: 0} as Computer);
                                                }
                                            }}>
                                                <SelectItem key="1">Laptop</SelectItem>
                                                <SelectItem key="2">Desktop</SelectItem>
                                                <SelectItem key="3">Printer</SelectItem>
                                                <SelectItem key="4">Copier</SelectItem>
                                                <SelectItem key="5">Phone</SelectItem>
                                                <SelectItem key="6">Kiosk</SelectItem>
                                                <SelectItem key="7">Tablet</SelectItem>
                                                <SelectItem key="0">Unknown</SelectItem>
                                            </Select>) : newComputer?.type}

                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Condition <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Select placeholder={mode === EditMode.Add ? "This field is required..." : newComputer?.condition.toString()} aria-label={"The condition of device."} onSelectionChange={(keys) =>
                                            {
                                                const items = [...keys] as string[];
                                                if (items.length > 0)
                                                {
                                                    try
                                                    {
                                                        setNewComputer({...newComputer, condition: parseInt(items[0])} as Computer);
                                                    } catch (e)
                                                    {
                                                        setNewComputer({...newComputer, condition: 0} as Computer);
                                                        console.error(e);
                                                    }
                                                } else
                                                {
                                                    setNewComputer({...newComputer, condition: 0} as Computer);
                                                }
                                            }}>
                                                <SelectItem key="1">Broken</SelectItem>
                                                <SelectItem key="2">Good/Used</SelectItem>
                                                <SelectItem key="3">Refurbished / Open Box</SelectItem>
                                                <SelectItem key="4">Display</SelectItem>
                                                <SelectItem key="5">New</SelectItem>
                                                <SelectItem key="0">Unknown</SelectItem>
                                            </Select>) : newComputer?.condition}

                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Operating System <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete onClick={(e) => (e.target as HTMLInputElement).focus()} aria-label={"Computers operating system"} menuTrigger={"input"} allowsCustomValue placeholder={mode === EditMode.Add ? "This field is required..." : newComputer?.operating_system.toString()}
                                                                   onInputChange={(key) =>
                                                                   {
                                                                       setNewComputer({...newComputer, operating_system: key} as Computer);

                                                                   }}
                                            >
                                                {uniqueFields.operating_system.map((os) => <SelectItem key={os} aria-label={`Operating System: ${os}`}>{os}</SelectItem>)}
                                            </Autocomplete>) : newComputer?.operating_system.toString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Make <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete allowsCustomValue onClick={(e) => (e.target as HTMLInputElement).focus()} aria-label={"Computer make or brand"} placeholder={mode === EditMode.Add ? "This field is required..." : newComputer?.make.toString()}
                                                                   onInputChange={(key) =>
                                                                   {
                                                                       setNewComputer({...newComputer, make: key} as Computer);
                                                                   }}
                                            >
                                                {uniqueFields.make.map((make) => <SelectItem key={make} aria-label={`Make: ${make}`}>{make}</SelectItem>)}
                                            </Autocomplete>) : newComputer?.make.toString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Model</TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete allowsCustomValue onClick={(e) => (e.target as HTMLInputElement).focus()} aria-label={"Computer model or serial number"} placeholder={mode === EditMode.Add ? "This field is optional..." : newComputer?.model.toString()}
                                                                   onInputChange={(key) =>
                                                                   {
                                                                       setNewComputer({...newComputer, model: key} as Computer);
                                                                   }}
                                            >
                                                {uniqueFields.model.map((model) => <SelectItem key={model} aria-label={`Model: ${model}`}>{model}</SelectItem>)}
                                            </Autocomplete>) : computer?.model.toString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Location <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete allowsCustomValue onClick={(e) => (e.target as HTMLInputElement).focus()} aria-label={"The location of the device"} placeholder={mode === EditMode.Add ? "This field is required..." : newComputer?.location.toString()}
                                                                   onInputChange={(key) =>
                                                                   {
                                                                       setNewComputer({...newComputer, location: key} as Computer);
                                                                   }}
                                            >
                                                {uniqueFields.location.map((location) => <SelectItem key={location} aria-label={`Model: ${location}`}>{location}</SelectItem>)}
                                            </Autocomplete>) : computer?.location.toString()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Primary User <span className={"text-danger"}>*</span></TableCell>
                                        <TableCell>
                                            {edit ? (<Autocomplete onClick={(e) => (e.target as HTMLInputElement).focus()} aria-label={"The primary user of the device"} placeholder={mode === EditMode.Add ? "This field is required..." : newComputer?.primary_user.toString()} allowsCustomValue onInputChange={(key) =>
                                            {
                                                setNewComputer({...newComputer, primary_user: key} as Computer);
                                            }}>
                                                {uniqueFields.primary_user.map((user) => <SelectItem key={user} aria-label={`Model: ${user}`}>{user}</SelectItem>)}
                                            </Autocomplete>) : computer?.primary_user.toString()}
                                        </TableCell>
                                    </TableRow>
                                    {newComputer?.specs && Object.keys(newComputer.specs).map((key) =>
                                    {
                                        return (
                                            <TableRow key={key}>
                                                <TableCell className="capitalize">{key.replace(/_/g, " ")}</TableCell>
                                                <TableCell>{edit ? (<Input aria-label={`The ${key} of the device`} placeholder={key} value={newComputer.specs[key]} onValueChange={
                                                    (value) =>
                                                    {
                                                        value = value.trim();
                                                        if (value.trim() === "")
                                                            delete newComputer.specs[key]; // Removes the key if the value is empty.
                                                        else
                                                            newComputer.specs[key] = value;

                                                        setNewComputer({...newComputer} as Computer);
                                                    }}/>) : newComputer.specs[key]}</TableCell>
                                            </TableRow>
                                        );

                                    })}
                                    {mode === EditMode.Add && specKeys.map((key) =>
                                    {
                                        return (
                                            <TableRow key={key}>
                                                <TableCell>{key}</TableCell>
                                                <TableCell>
                                                    <Input aria-label={`The ${key} of the device`} placeholder={"This field is optional..."} onValueChange={
                                                        (value) =>
                                                        {
                                                            if (value.trim() === "")
                                                                delete newComputer.specs[key]; // Removes the key if the value is empty.
                                                            else
                                                                newComputer.specs[key] = value;
                                                            setNewComputer({...newComputer} as Computer);
                                                        }}/>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    <TableRow>
                                        <TableCell>Notes</TableCell>
                                        <TableCell>
                                            {edit ? (<Textarea aria-label={"Any additional notes about the device"} placeholder={"Any notes that might be important"} value={newComputer?.notes} onValueChange={value =>
                                            {
                                                setNewComputer({...newComputer, notes: value} as Computer);
                                            }}/>) : computer?.notes}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Availability</TableCell>
                                        <TableCell className="flex justify-end">
                                            <Switch isDisabled={!edit} defaultSelected={(newComputer?.available ?? false) as boolean} onValueChange={value => setNewComputer({...newComputer, available: value} as Computer)}/>
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
                                <Button type={"submit"} color="primary"
                                        isDisabled={isMissingRequiredFields || isLoading}
                                        onPress={async () =>
                                        {
                                            if (isLoading) return;
                                            setIsLoading(true);
                                            // trim all values
                                            Object.keys(newComputer).forEach((key) =>
                                            {
                                                if (typeof newComputer[key] === "string")
                                                    newComputer[key] = newComputer[key].trim();
                                            });

                                            if (typeof newComputer.type === "string")
                                                newComputer.type = GetComputerTypeCode(newComputer.type);
                                            if (typeof newComputer.condition === "string")
                                                newComputer.condition = GetComputerConditionCode(newComputer.condition);

                                            if (newComputer.specs === null || newComputer.specs === undefined) newComputer.specs = {};

                                            newComputer.available = newComputer.available ? 1 : 0;
                                            if (mode === EditMode.Add || mode === EditMode.Duplicate)
                                            {
                                                // Add the new computer
                                                console.log("Adding computer", newComputer);
                                                await AddComputer(newComputer);
                                            } else if (mode === EditMode.Edit)
                                            {
                                                // Update the computer
                                                console.log("Editing computer", newComputer);
                                                await UpdateComputer(newComputer);
                                            } else
                                            {
                                                // View mode
                                                console.log(`Viewing computer ${newComputer.id}... How'd you click save!?!??!?!`); // This option should not happen.
                                            }
                                            setIsLoading(false);
                                            onAddOrUpdate(newComputer);
                                            setNewComputer({} as Computer);
                                            setTimeout(onClose, 1000);
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


import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import React from "react";

interface AlertProps {
    /**
     * The message variable represents a string value.
     *
     * @type {string}
     */
    message: string;
    /**
     * The type variable represents a string value.
     * The value can be 'success', 'error', or 'warning'.
     * @type {'success' | 'error' | 'warning'}
     */
    type: 'success' | 'error' | 'warning';
    /**
     * The closeButtonText variable represents a string value.
     * @type {string}
     */
    closeButtonText: string;
    /**
     * The onClose variable represents a function.
     * @type {() => void}
     */
    onClose: () => void;

    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
        onOpenChange: () => void;
    };
}

interface ConfirmAlertProps {
    /**
     * The message variable represents a string value.
     *
     * @type {string}
     */
    message: string;
    /**
     * The type variable represents a string value.
     * The value can be 'success', 'error', or 'warning'.
     * @type {'success' | 'error' | 'warning'}
     */
    type: 'success' | 'error' | 'warning';
    /**
     * The closeButtonText variable represents a string value.
     * @type {string}
     */
    closeButtonText: string;
    /**
     * The confirmButtonText variable represents a string value.
     * @type {string}
     */
    confirmButtonText: string;
    /**
     * The onClose variable represents a function.
     * @type {(value: boolean) => void} - The value is a boolean.
     */
    onClose: (value: boolean) => void;

    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
        onOpenChange: () => void;
    };
}

export default function Alert(props: AlertProps) {
    const {isOpen, onOpenChange} = props.disclosure;
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="min-w-[500px] w-[25vw] max-w-[800px]">
            <ModalHeader>
                <h2>{props.type}</h2>
            </ModalHeader>
            <ModalContent>
                <p>{props.message}</p>
            </ModalContent>
            <ModalFooter>
                <Button onClick={props.onClose}>{props.closeButtonText}</Button>
            </ModalFooter>
        </Modal>
    )
}

export function Confirm(props: ConfirmAlertProps) {
    const {isOpen, onOpenChange} = props.disclosure;
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="min-w-[500px] w-[25vw] max-w-[800px] min-h-[200px]">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className={"capitalize"}>{props.type}</ModalHeader>
                        <ModalBody className={"overflow-y-auto text-wrap"}>
                            <p>{props.message}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant={"light"} onPress={() => {
                                props.onClose(false)
                                onClose();
                            }}>{props.closeButtonText}</Button>
                            <Button color="primary" onPress={() => {
                                props.onClose(true);
                                onClose();
                            }}>{props.confirmButtonText}</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )

}
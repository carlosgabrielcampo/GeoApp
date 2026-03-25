import { MouseEventHandler, ReactElement, ChangeEventHandler } from "react";

export interface ButtonInterface {
    styleType: "default" | "warning" | "action" | "round",
    type: "submit" | "reset" | "button" | undefined,
    onclick?: MouseEventHandler<HTMLButtonElement>,
    children: ReactElement<string>
    disabled?: boolean
    width?: string
}

export interface InputInterface {
    styleType: 'default',
    value: string | number, 
    onchange: ChangeEventHandler<HTMLInputElement>, 
    type: string, 
    placeholder?: string, 
    width?: string
}

export interface LabelInterface { 
    value: ReactElement,
    styleType: "default" 
}
export interface SelectInterface { 
    options: string[], 
    disabled?: true, onchange?: ChangeEventHandler<HTMLSelectElement> 
}

export interface TextInterface {
    styleType: "default" | "title" | "sm-muted" | "sm",
    value: string
}

export interface TextAreaInterface {
    value: string
    styleType: 'default',
    onchange: ChangeEventHandler<HTMLTextAreaElement, HTMLTextAreaElement>,
    placeholder: string
}
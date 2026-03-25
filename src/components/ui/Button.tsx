import { MouseEventHandler, ReactElement } from "react";

interface ButtonInterface {
    onclick?: MouseEventHandler<HTMLButtonElement>,
    styleType: "default" | "warning" | "action",
    type: "submit" | "reset" | "button" | undefined,
    children: ReactElement<string>
    width?: string
    disabled?: boolean
}

export default function Button(
  {
    onclick,
    styleType,
    type,
    children,
    width,
    disabled
  }: ButtonInterface,
){
  const buttonStyle = {
    "default": "rounded-lg border border-slate-300 p-2 font-mono text-xs hover:bg-slate-50",
    "action": "rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300",
    "warning": "rounded-lg border bg-[#ef3840] text-white border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#ef3840]/90"
  }
  return <button
    disabled={disabled}
    style={{ width }}
    type={type}
    onClick={onclick}
    className={buttonStyle[styleType] || buttonStyle["default"]}
  >
    {children}
  </button>
}
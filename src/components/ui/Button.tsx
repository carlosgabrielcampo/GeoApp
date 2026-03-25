import { MouseEventHandler, ReactElement } from "react";

interface buttonInterface {
    onclick: MouseEventHandler<HTMLButtonElement>,
    styleType: 'default',
    type: "submit" | "reset" | "button" | undefined,
    children: ReactElement<string>
    width: string
}

export default function Button(
  {
    onclick,
    styleType,
    type,
    children,
    width
  }: buttonInterface,
){
  const buttonType = {
    'default': "rounded-lg border border-slate-300 p-2 font-mono text-xs hover:bg-slate-50",
    'warning': "rounded-lg border bg-[#ef3840] text-white border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#ef3840]/90"
  }
  return <button
    style={{ width }}
    type={type}
    onClick={onclick}
    className={buttonType[styleType] || buttonType['default']}
  >
    {children}
  </button>
}
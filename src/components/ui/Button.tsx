import { ButtonInterface } from "@/types/ui"

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
    "default": "flex items-center gap-2 justify-center rounded-2xl border border-slate-300 p-2 font-mono text-xs transition hover:bg-slate-50",
    "action": "flex items-center gap-2 justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300",
    "warning": "flex items-center gap-2 justify-center rounded-2xl border bg-[#ef3840] text-white border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#ef3840]/90",
    "round": "mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50"
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
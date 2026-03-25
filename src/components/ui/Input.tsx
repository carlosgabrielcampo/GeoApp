import { ChangeEventHandler } from "react";

export default function Input(
  { value, onchange, type, placeholder, width }:
  { value: string | number, onchange: ChangeEventHandler<HTMLInputElement>, type: string, placeholder?: string, width?: string }
){
  return <div
    style={{ width }}
    className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600"
  >
    <input
      type={type}
      onChange={onchange}
      className="overflow-hidden"
      value={value}
      placeholder={placeholder}
    />
  </div>
}
import { ChangeEventHandler } from "react";

interface InputInterface {
    styleType: 'default',
    value: string | number, 
    onchange: ChangeEventHandler<HTMLInputElement>, 
    type: string, 
    placeholder?: string, 
    width?: string
}

export default function Input(
  { value, onchange, type, placeholder, width, styleType }: InputInterface
){
  const inputStyle = {
    'default': 'rounded-lg text-sm border border-slate-300 px-4 py-2 text-slate-900 outline-none transition focus:border-slate-500',
  }

  return <div
    style={{ width }}
    className={inputStyle[styleType] || inputStyle['default']}
  >
    <input
      type={type}
      onChange={onchange}
      className="overflow-hidden w-[100%]"
      value={value}
      placeholder={placeholder}
    />
  </div>
}
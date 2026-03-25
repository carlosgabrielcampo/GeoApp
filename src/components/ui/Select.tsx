import { SelectInterface } from "@/types/ui";

export default function Select(
  { options, disabled, onchange }: SelectInterface
){
  return <>
    <select
      defaultValue={options[0]}
      disabled={disabled}
      className="rounded-lg text-sm border border-slate-300 bg-slate-100 px-3 py-2 text-slate-900"
      onChange={onchange}
    >
      {
        options?.length
          ? options.map((option) => <option key={option} value={option}>{option}</option>)
          : null
      }
    </select>
  </>
}
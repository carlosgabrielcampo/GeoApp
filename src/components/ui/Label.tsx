import { LabelInterface } from "@/types/ui"
export default function Label({value, styleType }: LabelInterface ) {
    const labelStyle = {
        'default': "flex flex-col gap-1 text-sm text-slate-700"
    }
    return value
        ? <label className={labelStyle[styleType] || labelStyle['default']}>{value}</label>
        : null
}